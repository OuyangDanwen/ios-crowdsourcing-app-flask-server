from flask import request, jsonify, send_file
from werkzeug.utils import secure_filename
from app import app
import os
from ..db.schema import *
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity, revoke_token, create_access_token,
    get_raw_jwt)
import datetime
from pymongo import MongoClient
from simplekv.db.mongo import MongoStore
import json
from ..logic.helper_functions import *
from ..logic.db_operations import *
from ..adapter.ContentFeedAdapter import *
import uuid

connection = MongoClient('localhost', 27017)
db = connection['mindsight']
# auth stuff
app.secret_key = 'super-secret'
app.config['JWT_BLACKLIST_ENABLED'] = True
# Datastore for JWT
app.config['JWT_BLACKLIST_STORE'] = MongoStore(db, 'skv')
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = 'all'
# TODO: Tweak this in the future
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=1000000)
jwt = JWTManager(app)

# Store session data
localSessionStorage = MongoStore(db, 'session')

# Return true if so
def user_exists(username):
    user = User.objects(username=username)
    if len(user) != 0:
        return True
    return False

def get_jwt_identity_override():
    key = get_jwt_identity()
    username = key.split('.')[1]
    return username

def get_session_object():
    key = get_jwt_identity()
    sess = localSessionStorage.get(key)
    return sess

# Key is the identity encapsulated in JWT
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.key


# Extend it to store whatever attributes you want
class UserSession:
    def __init__(self, key, username, location):
        self.key = key
        self.username = username
        # longitude, latitude
        # coordinates : [34.444 ,  34.444]
        self.location = location

def revoke_current_token():
    current_token = get_raw_jwt()
    jti = current_token['jti']
    revoke_token(jti)

TRAIN_STATS_FILE = "/home/ec2-user/Server/tensorflow/training_stats/time.txt"
CURRENT_SERVER_VERSION = "0.0.1"
from flask import render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
from app import app
import os
import tensorflow as tf
from schema import *
from flask_jwt_extended import JWTManager, jwt_required, \
    get_jwt_identity, revoke_token, create_access_token, \
    get_raw_jwt
import datetime
from pymongo import MongoClient
from simplekv.db.mongo import MongoStore
import json
import base64
import datetime
from PIL import Image

# MAIN TASK : FIGURE OUT ASYNCHRONOUS DATABASE CALLS!!!!

# connection for kv
connection = MongoClient('localhost', 27017)
db = connection['mindsight']
# auth stuff
app.secret_key = 'super-secret'
app.config['JWT_BLACKLIST_ENABLED'] = True
# Datastore for JWT
app.config['JWT_BLACKLIST_STORE'] = MongoStore(db, 'skv')
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = 'all'
# TODO: Tweak this in the future
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=10000)
jwt = JWTManager(app)

# Return true if so
def user_exists(username):
    user = User.objects(username=username)
    if len(user) != 0:
        return True
    return False

@app.route('/api/register', methods=['POST'])
def register():
    name = request.json.get('name', None)
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username is None or password is None or name is None:
        return jsonify({"msg": "Invalid request"}), 401
    if user_exists(username):
        return jsonify({"msg": "User already exists"}), 401
    user = User(
        name=name,
        # TODO: Make this not-static
        usertype="user",
        username=username, 
        password=password, 
        createdOn=datetime.datetime.now(),
        lastLogin=datetime.datetime.now()
    )
    user.save()
    ret = {
        'access_token': create_access_token(identity=username)
    }
    return jsonify(ret), 200

# Standard login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    user = User.objects(username=username, password=password)
    if len(user) == 0:
        return jsonify({"msg": "Bad User or Password"}), 401
    User.objects(username=username).update_one(lastLogin=datetime.datetime.now())
    ret = {
        'access_token': create_access_token(identity=username)
    }
    return jsonify(ret), 200

def _revoke_current_token():
    current_token = get_raw_jwt()
    jti = current_token['jti']
    revoke_token(jti)

# Endpoint for revoking the current users access token
@app.route('/api/logout', methods=['GET'])
@jwt_required
def logout():
    try:
        _revoke_current_token()
    except KeyError:
        return jsonify({
            'msg': 'Access token not found in the blacklist store'
        }), 500
    return jsonify({"msg": "Successfully logged out"}), 200

# Route for testing if auth works
@app.route('/api/protected', methods=['GET'])
@jwt_required
def protected():
    current_user = get_jwt_identity()
    return jsonify({'Your authentication works!': current_user}), 200

@app.route('/api/version', methods=['GET'])
@jwt_required
def version():
    return jsonify({'version': tf.__version__}), 200

@app.route('/api/labels', methods=['GET'])
@jwt_required
def getlabels():
    labels = [lb for lb in Label.objects()]
    ret = {
        "labels": json.loads(json.dumps(labels, cls=MongoEncoder))
    }
    return jsonify(ret), 200
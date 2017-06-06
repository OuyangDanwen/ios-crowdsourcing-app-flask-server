from flask import Flask, request, redirect, url_for
from flask_restful import reqparse, abort, Api, Resource
from werkzeug.utils import secure_filename
import os
import logging
from mongoengine import *
from flask_cors import CORS, cross_origin

UPLOAD_FOLDER = '/home/ec2-user/Server/file_system/train_image/'
TEMP_FOLDER = '/home/ec2-user/Server/file_system/temp/'
LABEL_FOLDER = '/home/ec2-user/Server/tensorflow/retrained_model/bottleneck/'

app = Flask(__name__)
# Debugging
gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.DEBUG)
app.logger.debug('this will show in the log')
# CORS
CORS(app)
# Configs
app.config.from_object('config')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TEMP_FOLDER'] = TEMP_FOLDER
app.config['LABEL_FOLDER'] = LABEL_FOLDER
# DB Connection
connect('mindsight', host='mongodb://127.0.0.1/mindsight', port=27017)
# Set JWT-Authentication
from app import views, api
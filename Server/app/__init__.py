from flask import Flask, request, redirect, url_for
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = '/home/danwen/Work/Server/file_system/train_image/'
TEMP_FOLDER = '/home/danwen/Work/Server/file_system/temp/'

app = Flask(__name__)
app.config.from_object('config')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TEMP_FOLDER'] = TEMP_FOLDER

from app import views

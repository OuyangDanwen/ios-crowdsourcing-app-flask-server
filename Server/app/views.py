from flask import render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
from app import app
import os
import tensorflow as tf

ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handleLabel(text, file):
	labels = os.listdir(app.config['UPLOAD_FOLDER'])
	if text.lower() in labels:
		path = os.path.join(app.config['UPLOAD_FOLDER'], text)
		file.save(os.path.join(path, file.filename))
	else :
		newdir = os.path.join(app.config['UPLOAD_FOLDER'], text.lower())
		os.mkdir(newdir)
		file.save(os.path.join(newdir, secure_filename(file.filename)))


@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET','POST'])
def index():
	if request.method == 'POST':
		file = request.files['file']
		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			if 'upload' in request.form:
				handleLabel(request.form['text'], file)
			elif 'predict' in request.form:
				file.save(os.path.join(app.config['TEMP_FOLDER'], filename))
				return redirect(url_for('predict_image', filename = filename))
			else :
				return redirect(url_for(request.url))
	user = {'name': 'Danwen'}
	return render_template('index.html', 
		title='Dashboard', user=user)

@app.route('/get_labels', methods=["GET"])
def get_labels():
	from get_labels import getLabels
	labels = getLabels()
	return render_template('get_labels.html', title="Labels", labels=labels)


@app.route('/predict_image', methods=["GET"])
def predict_image():
	filename = request.args['filename']
	filename = app.config['TEMP_FOLDER'] + filename
	from predict_image import predictImage
	output = predictImage(filename)
	return render_template('predict_image.html', output=output)

@app.route('/show_version', methods=["GET"])
def show_version():
	return render_template('show_version.html', version=tf.__version__)

@app.route('/retrain_model', methods=["GET"])
def retrain_module():
	from retrain_model import retrain
	#retrain()
	message = "success"
	return render_template('retrain_model.html', message = message)

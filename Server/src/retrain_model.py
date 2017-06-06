#!/usr/bin/python
import subprocess
import os
import shutil
from datetime import datetime
from app import schema, app
from mongoengine.connection import _get_db

TRAIN_STATS_FILE = "/home/ec2-user/Server/tensorflow/training_stats/time.txt"
CWD = "/home/ec2-user/Server/tensorflow/tensorflow/"
NEW_MODEL_DIR = "/home/ec2-user/Server/tensorflow/new_model"
RETRAINED_MODEL_DIR = "/home/ec2-user/Server/tensorflow/retrained_model"
TRAIN_IMAGE_DIR = "/home/ec2-user/Server/file_system/train_image"

def insert_training_data_and_create_labels():
	cwd = os.listdir(app.config['UPLOAD_FOLDER'])
	for dir in cwd:
	    label_path = os.path.join(app.config['UPLOAD_FOLDER'], dir)
	    lb = schema.Label(name=dir, path= label_path, createdOn=datetime.now())
	    lb.save()
	    files = os.listdir(label_path)
	    for file in files:
	        file_path = os.path.join(label_path, file)
	        img = schema.Image(name=file, path=file_path, label=lb, createdOn=datetime.now())
	        img.save()
	return        

def dirCount(path, map = {}):
	count = 0
  	for f in os.listdir(path):
  		child = os.path.join(path, f)
    	if os.path.isdir(child):
			child_count = dirCount(child, map)
			count += child_count + 1
  	map[path] = count
  	return count

def fileCount(folder):
    count = 0

    for filename in os.listdir(folder):
        path = os.path.join(folder, filename)

        if os.path.isfile(path):
            count += 1
        elif os.path.isdir(path):
            count += fileCount(path)

    return count

def retrain():

	os.chdir(CWD)
	#clear new_model dir
	if os.path.exists(NEW_MODEL_DIR):
		return
	os.makedirs(NEW_MODEL_DIR)

	start = datetime.now()

	#if other errors persist, try to run ./configure in terminal
	run_retrainer = subprocess.check_call("python tensorflow/examples/image_retraining/retrain.py", shell=True)
	if run_retrainer != 0:
		bazel_clean = subprocess.check_call("bazel clean")
		build_retrainer = subprocess.check_call("bazel build --config=opt --local_resources 2048,.5,1.0 tensorflow/examples/image_retraining:retrain")
		run_retrainer = subprocess.check_call("python tensorflow/examples/image_retraining/retrain.py")
	
	end = datetime.now()
	elapsed_time = end - start

	with open(TRAIN_STATS_FILE, "a+") as f:
		f.write("Retraining date: " + str(datetime.now()) + ", ")
		f.write("Time spent: " + str(elapsed_time) + ",")
		f.write("Data size: " + str(dirCount(TRAIN_IMAGE_DIR)) +
		 " classes with " + str(fileCount(TRAIN_IMAGE_DIR)) + " images trained.")
		f.write("\n")

	#remove the old model dir "retrained_model"
	#rename the new model dir to "retrained_model" for convenience
	if os.path.exists(RETRAINED_MODEL_DIR):
		shutil.rmtree(RETRAINED_MODEL_DIR)
	#insert_training_data_and_create_labels()
	os.rename(NEW_MODEL_DIR,RETRAINED_MODEL_DIR)
	db = _get_db()
	collections = db.collection_names()
	for collection in collections:
		db.drop_collection(collection)
	insert_training_data_and_create_labels()
	return

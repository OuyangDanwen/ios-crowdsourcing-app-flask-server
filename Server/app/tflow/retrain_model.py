#!/usr/bin/python
import subprocess
import os
import shutil
from datetime import datetime
from app import schema, app

TRAIN_STATS_FILE = "/home/ec2-user/Server/tensorflow/training_stats/time.txt"
CWD = "/home/ec2-user/Server/tensorflow/tensorflow/"
NEW_MODEL_DIR = "/home/ec2-user/Server/tensorflow/new_model"
RETRAINED_MODEL_DIR = "/home/ec2-user/Server/tensorflow/retrained_model"
TRAIN_IMAGE_DIR = "/home/ec2-user/Server/file_system/train_image"     

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
    try:
        run_retrainer = subprocess.check_call("python tensorflow/examples/image_retraining/retrain.py", shell=True)
    except Exception:
        shutil.rmtree(NEW_MODEL_DIR)
    # if run_retrainer != 0:
    # 	bazel_clean = subprocess.check_call("bazel clean")
    # 	build_retrainer = subprocess.check_call("bazel build --config=opt --local_resources 2048,.5,1.0 tensorflow/examples/image_retraining:retrain")
    # 	run_retrainer = subprocess.check_call("python tensorflow/examples/image_retraining/retrain.py")

    end = datetime.now()
    elapsed_time = end - start

    with open(TRAIN_STATS_FILE, "a+") as f:
        f.write("Retraining date: " + str(start) + ", ")
        f.write("Time spent: " + str(elapsed_time) + ", ")
        f.write("Number of labels trained: " + str(len(os.listdir(TRAIN_IMAGE_DIR))) + ", ")
        f.write("Number of images trained: " + str(fileCount(TRAIN_IMAGE_DIR)))
        f.write("\n")

    #remove the old model dir "retrained_model"
    #rename the new model dir to "retrained_model" for convenience
    if os.path.exists(RETRAINED_MODEL_DIR):
        shutil.rmtree(RETRAINED_MODEL_DIR)
    os.rename(NEW_MODEL_DIR,RETRAINED_MODEL_DIR)
    return

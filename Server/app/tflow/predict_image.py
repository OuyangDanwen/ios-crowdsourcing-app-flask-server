#!/usr/bin/python
# Windows users comment this (config issue)
import numpy as np
import tensorflow as tf
import os
from datetime import datetime

imagePath = '/home/ec2-user/Server/file_system/test_image/laptop.jpeg'
modelFullPath = '/home/ec2-user/Server/tensorflow/retrained_model/output_graph.pb'
labelsFullPath = '/home/ec2-user/Server/tensorflow/retrained_model/output_labels.txt'

def parseAnswer(answer, scores, requestFrom):
    lbs = []
    size = len(answer)
    if requestFrom == "dashboard":
            for index in range(size):
                dic = {}
                dic['label'] = str(answer[index])
                dic['confidence'] = str("{0:.2f}%".format(scores[index]*100))
                lbs.append(dic)
    else:
        for index in range(size):
            dic = {}
            dic['label'] = str(answer[index])
            dic['confidence'] = str("{0:.2f}".format(scores[index]))
            lbs.append(dic)
    return lbs

def create_graph():
    """Creates a graph from saved GraphDef file and returns a saver."""
    # Creates graph from saved graph_def.pb.
    with tf.gfile.FastGFile(modelFullPath, 'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        _ = tf.import_graph_def(graph_def, name='')

def predictImage(filename, requestFrom):
    imagePath = filename
    answer = []
    scores = []

    if not tf.gfile.Exists(imagePath):
        tf.logging.fatal('File does not exist %s', imagePath)
        return imagePath

    image_data = tf.gfile.FastGFile(imagePath, 'rb').read()

    # Creates graph from saved GraphDef.
    f = open("/home/ec2-user/Server/log.txt", "a+")

    with tf.Session() as sess:
        start = datetime.now()
        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
        end = datetime.now()
        elapsed_time = end - start
        f.write("Time spent on starting tensorflow session: " + str(elapsed_time) + ", ")
        
        start = datetime.now()
        predictions = sess.run(softmax_tensor,
                               {'DecodeJpeg/contents:0': image_data})
        end = datetime.now()
        elapsed_time = end - start
        f.write("Time spent on prediction: " + str(elapsed_time) + ", ")
        predictions = np.squeeze(predictions)

        top_k = predictions.argsort()[-5:][::-1]  # Getting top 5 predictions
        f = open(labelsFullPath, 'rb')
        lines = f.readlines()
        labels = [str(w).replace("\n", "") for w in lines]
        for node_id in top_k:
            human_string = labels[node_id]
            score = predictions[node_id]
            print('%s (score = %.5f)' % (human_string, score))
        for index in top_k:
            answer.append(labels[index])
            scores.append(predictions[index])
        print(scores)

        lbs = parseAnswer(answer, scores, requestFrom)
        return lbs

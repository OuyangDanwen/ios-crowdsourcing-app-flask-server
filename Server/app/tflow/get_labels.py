#!/usr/bin/python
import os, sys
import sys


def getLabels():
    labels = os.listdir('/home/ec2-user/Server/tensorflow/retrained_model/bottleneck')
    return labels

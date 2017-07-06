from db_operations import *
from ..tflow.predict_image import create_graph, predictImage
import os
from PIL import Image
from PIL import ImagePath
import shutil
try:
    import numpy as np
    from shapely.geometry import Point
    from shapely.geometry import Polygon
except ImportError:
    print "Cannot import numpy in helper_functions.py"

isGraphCreated = False
UPLOAD_FOLDER = '/home/ec2-user/Server/file_system/train_image/'
RESOURCE_FOLDER = '/home/ec2-user/Server/file_system/resources'
THUMBNAIL_FOLDER = '/home/ec2-user/Server/file_system/thumbnails'


# start of prediction helper functions
def predict_helper(img_path, requestFrom):
    f = open("/home/ec2-user/Server/log.txt", "a+")
    from datetime import datetime	
    start = datetime.now()
    global isGraphCreated
    if not isGraphCreated:
        create_graph()
        isGraphCreated = True
    end = datetime.now()
    lbs = predictImage(img_path, requestFrom)
    final_end = datetime.now()
    elapsed_time = end - start
    final_elapsed_time = final_end - start
    f.write("Time spent on loading the graph: " + str(elapsed_time) + "\n")
    f.write("Total time spent: " + str(final_elapsed_time) + ".\n")
    f.close()
    return lbs
#  end of prediction helper functions


# start of addLabel helper functions
# TODO: handling of single instance of data should be made general later
def handleLabelForSingleImage(img, label, username, coordinates):
    labels = os.listdir(UPLOAD_FOLDER)
    dirCount = {}
    if label in labels:
        dirCount[label] = len(os.listdir(os.path.join(UPLOAD_FOLDER, label))) + 1
        imgName = label + '_' + str(dirCount[label]) + ".jpeg"
        imgPath = os.path.join(label, imgName)
        imgPath = os.path.join(UPLOAD_FOLDER, imgPath)
        with open(imgPath, 'wb') as f:
            f.write(img)
        cropImageExact(imgPath, label, coordinates)
        add_label_and_image(label, imgName, username)
        resize(imgPath, imgPath)
        createThumbnail(label, imgName)
    else :
        newdir = os.path.join(UPLOAD_FOLDER, label)
        os.mkdir(newdir)
        imgName = label + '_1.jpeg' 
        imgPath = os.path.join(newdir, imgName)
        with open(imgPath, 'wb') as f:
            f.write(img)
        cropImageExact(imgPath, label, coordinates)
        add_label_and_image(label, imgName, username)
        resize(imgPath, imgPath)
        mkdir(os.path.join(THUMBNAIL_FOLDER, label))
        createThumbnail(label, imgName)


def saveLabel(label, username):
    labels = os.listdir(UPLOAD_FOLDER)
    if label not in labels:
        newdir = os.path.join(UPLOAD_FOLDER, label)
        os.mkdir(newdir)
        os.mkdir(os.path.join(THUMBNAIL_FOLDER, label))
        create_label(label, username)


def saveLabelPhotos(files, label, username):
    dirCount = {}
    for file in files:
        dirCount[label] = len(os.listdir(os.path.join(UPLOAD_FOLDER, label))) + 1
        imgName = label + '_' + str(dirCount[label]) + ".jpeg"
        imgPath = os.path.join(label, imgName)
        imgPath = os.path.join(UPLOAD_FOLDER, imgPath)
        file.save(imgPath)
        resize(imgPath, imgPath)
        createThumbnail(label, imgName)
        add_label_and_image(label, imgName, username)


# start of edit label helper functions
def editLabel(oldLabel, newLabel):
    curLabels = os.listdir(UPLOAD_FOLDER)
    if oldLabel not in curLabels:
        raise Exception('cannot find label')
    if newLabel in curLabels:
        raise Exception('label already exisits')
    oldPath = os.path.join(UPLOAD_FOLDER, oldLabel)
    newPath = os.path.join(UPLOAD_FOLDER, newLabel)
    oldThumbnailPath = os.path.join(THUMBNAIL_FOLDER, oldLabel)
    newThumbnailPath = os.path.join(THUMBNAIL_FOLDER, newLabel)
    os.rename(oldPath, newPath)
    os.rename(oldThumbnailPath, newThumbnailPath)
    return newPath

# end of edit label helper functions


# start of resize helper functions
def resize(imgPath, thumbnailPath):
    maxWidth = 640
    maxHeight = 480
    im = Image.open(imgPath)
    width, height = im.size
    if maxWidth > width:
        return False
    else:
        ratio = min(maxWidth *1.0 / width, maxHeight * 1.0 / height)
        size = width*ratio, height*ratio
        im.thumbnail(size, Image.ANTIALIAS)
        im.save(thumbnailPath, "JPEG")
        return True
# end of resize helper functions


def normalizeFilename():
    labels = os.listdir(UPLOAD_FOLDER)
    for label in labels:
        label_path = os.path.join(UPLOAD_FOLDER, label)
        files = os.listdir(label_path)
        index = 1
        for file in files:
            filename = str(label) + '_' + str(index) + '.jpeg'
            os.rename(os.path.join(label_path, file), os.path.join(label_path, filename))
            index = index + 1


# resize all training images
def resizeAllImages(width, height):
    maxWidth = width
    maxHeight = height
    labels = os.listdir(UPLOAD_FOLDER)
    for label in labels:
        labelPath = os.path.join(UPLOAD_FOLDER, label)
        imgs = os.listdir(labelPath)
        for img in imgs:
            imgPath = os.path.join(labelPath, img)
            im = Image.open(imgPath)
            width, height = im.size
            if maxWidth > width and maxHeight > height:
                continue
            else:
                ratio = min(maxWidth *1.0 / width, maxHeight * 1.0 / height)
                size = width*ratio, height*ratio
                im.thumbnail(size, Image.ANTIALIAS)
                im.save(imgPath, "JPEG")


# create thumbnails of all existing images to a permanent folder
def createThumbnails():
    shutil.rmtree(THUMBNAIL_FOLDER)
    os.mkdir(THUMBNAIL_FOLDER)
    size = 240, 180
    labels = os.listdir(UPLOAD_FOLDER)
    for label in labels:
        thumbnail_label = os.path.join(THUMBNAIL_FOLDER, label)
        os.mkdir(thumbnail_label)
        labelPath = os.path.join(UPLOAD_FOLDER, label)
        imgs = os.listdir(labelPath)
        for img in imgs:
            imgPath = os.path.join(labelPath, img)
            im = Image.open(imgPath)
            im.thumbnail(size, Image.ANTIALIAS)
            newPath = os.path.join(thumbnail_label, img)
            im.save(newPath, "JPEG")


def createThumbnail(label, imgName):
    size = 240, 180
    imgPath = os.path.join(label, imgName)
    im = Image.open(os.path.join(UPLOAD_FOLDER, imgPath))
    im.thumbnail(size, Image.ANTIALIAS)
    newPath = os.path.join(THUMBNAIL_FOLDER, imgPath)
    im.save(newPath, "JPEG")


# crop the image based by reconstructing user tracing with the mobile application
def cropImage(imgPath, label, coordinates):
    if len(coordinates) != 0:
        pixels = []
        for coordinate in coordinates:
            x = (float)(coordinate.split(',')[0])
            y = (float)(coordinate.split(',')[1])
            pixels.append((x,y))
        im = Image.open(imgPath)
        contour = ImagePath.Path(pixels)
        minimalBound = contour.getbbox()
        im = im.crop(minimalBound)
        im.save(imgPath)

def cropImageExact(imgPath, label, coordinates):
    if len(coordinates) == 0:
        return
    points = []
    for coordinate in coordinates:
        x = (float)(coordinate.split(',')[0])
        y = (float)(coordinate.split(',')[1])
        points.append((y,x))
    im = Image.open(imgPath).convert('RGBA')
    pixels = np.array(im)
    im_copy = np.array(im)
    region = Polygon(points)

    for index, pixel in np.ndenumerate(pixels):
        row, col, channel = index
        if channel != 0:
            continue
        point = Point(row, col)
        if not region.contains(point):
            im_copy[(row, col, 0)] = 255
            im_copy[(row, col, 1)] = 255
            im_copy[(row, col, 2)] = 255
            im_copy[(row, col, 3)] = 0

    cut_image = Image.fromarray(im_copy)
    cut_image.save(imgPath)


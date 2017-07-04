from mongoengine import *
from json import JSONEncoder
from bson.json_util import default


# For serializing classes that don't inherit directly from Document, add statement in if condition
class MongoEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, Document) or isinstance(o, Resource) or isinstance(o, Label) \
                or isinstance(o, Image) or isinstance(o, User):
            return o.to_mongo()
        return default(o)


class User(Document):
    # Maybe it's needed in the future? Figure out other roles
    usertype = StringField(required=True)
    name = StringField(required=True)
    username = StringField(required=True, unique=True)
    # TODO: Make this secure :D
    password = StringField(required=True)
    createdOn = DateTimeField()
    lastLogin = DateTimeField()


class MetaData(EmbeddedDocument):
    name = StringField(required=True)
    meta = {'allow_inheritance': True}


class Wifi(MetaData):
    SSID = StringField(required=True)
    

class Location(MetaData):
    coordinates = StringField(required=True) 


class Label(Document):
    name = StringField(required=True, unique=True)
    path = StringField(required=True, unique=True) 
    createdOn = DateTimeField(required=True)
    createdBy = StringField()
   

class Image(Document):
    name = StringField(required=True, unique=True)
    path = StringField(required=True, unique=True)
    label = StringField(required=True)
    createdOn = DateTimeField(required=True)
    createdBy = StringField(required=True)
    

class Resource(Document):
    name = StringField(required=True, unique=True)
    path = StringField(required=True)
    label = StringField(required=True)
    location = PointField(required=True)
    meta = {'allow_inheritance': True}
    createdOn = DateTimeField(required=True) 
    createdBy = StringField(required=True)


# TODO: NAME CLASHES WITH MONGOENGINE CLASS DOCUMENT =/
class PDFDocument(Resource):
    extension = StringField(required=True)
    size = StringField(required=True)
    

class Link(Resource):
    url = StringField(required=True)
    

class Audio(Resource):
    extension = StringField(required=True)
    size = StringField(required=True)


class Video(Resource):
    extension = StringField(required=True)
    size = StringField(required=True)


class ContentFeed(Resource):
    adapterType = StringField(required=True)
    query = StringField(required=True)
    maxResults = IntField(required=True)

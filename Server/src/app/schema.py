from mongoengine import *
from json import JSONEncoder
from bson.json_util import default
from mongoengine import Document


class MongoEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, Document):
            return o.to_mongo()
        return default(o)


# TODO: Make things required
# TODO: Corect the structure
# TODO: Check for uniqueness
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
    name = StringField(required=True)
    path = StringField(required=True, unique=True)
    label = StringField(required=True)
    createdOn = DateTimeField(required=True)
    createdBy = StringField(required=True)
    

class Resources(Document):
    name = StringField(required=True)
    path = StringField(required=True, unique=True)  
    label = StringField(required=True)  
    meta = {'allow_inheritance': True}
    createdOn = DateTimeField(required=True) 
    createdBy = StringField(required=True)
    

class Documents(Resources):
    extension = StringField()
    size = StringField()
    

class Links(Resources):
    url = StringField(required=True)
    

class Audio(Resources):
    extension = StringField()
    size = StringField()
    playTime = StringField()
    

class Video(Resources):
    extension = StringField()
    size = StringField()
    playTime = StringField()
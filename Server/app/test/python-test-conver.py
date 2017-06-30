from pymongo import MongoClient
from ..db.schema import *

connect('mindsight', host='mongodb://127.0.0.1/mindsight', port=27017)
def test():
    imgs = [img for img in Image.objects()]
    bad_imgs = []
    for i in imgs:
        if("/" in i.name):
            if(i.name == i.path):
                bad_imgs.append(i)
    for i in bad_imgs:
        new_name = i.name.rsplit('/', 1)[-1]
        Image.objects(name=i.name).update(name=new_name)
        print "Updated " + new_name

def test2():
    print "ssucesss"

if __name__ == '__main__':
    test()
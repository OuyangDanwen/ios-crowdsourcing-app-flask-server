from ..db.schema import *

# useful for updating your mongo collections due to changing schema :(
connect('mindsight', host='mongodb://127.0.0.1/mindsight', port=27017)

# Adds location attribute to Resource collection
def add_location_to_resources():
    pass

# Update image paths
def update_image_path():
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


if __name__ == '__main__':
    pass

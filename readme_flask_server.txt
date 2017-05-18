Large files such as images, model files, tensorflow repo are removed.But I kept the file structures.
If you need the retrained model files, they can be found on googledrive. Links are given in tutorial.txt.
You should have your own version of tensorflow installed to make it work. Python version is 2.7.
This server might be specific to the build-from-source-version tensorflow with bazel build. But the changes should be manageable with other versions.
Remember to change file paths used in the server as it is specific to my machine. Sometimes the paths are confusing so I chose to use absolute paths to save time.
The retrain functionality is not tested as it will take too long :) But other functionalities should be working, at least on my machine.
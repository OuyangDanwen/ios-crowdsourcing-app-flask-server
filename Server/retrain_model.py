import subprocess

TRAINING_FOLDER = '/home/danwen/Work/Server/file_system/train_image/'

def retrain():
	build_retrainer = subsprocess.check_call(["bazel build tensorflow/examples/image_retraining:retrain",
		"--config=opt"])
	run_retrainer = subporcess.check_call(["bazel-bin/tensorflow/examples/image_retraining/retrain","--image_dir="+TRAINING_FOLDER])
	build_labels = subsporcess.check_call(["bazel build tensorflow/examples/label_image:label_image"])
	return
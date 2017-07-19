import os

CWD = "/home/ec2-user/Server/file_system/temp/prediction/"

users = os.listdir(CWD)
for user in users:
	user_folder = os.path.join(CWD, user)
	user_files = os.listdir(user_folder)
	for file in user_files:
		os.remove(os.path.join(user_folder, file))

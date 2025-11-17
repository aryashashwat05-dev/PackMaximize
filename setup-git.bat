@echo off
echo Initializing git repository...
git init

echo Adding remote origin...
git remote add origin https://github.com/aryashashwat05-dev/PackMaximize.git

echo Adding all files to staging area...
git add .

echo Committing changes...
git commit -m "Initial commit: PackMaximize project setup"

echo Pushing to GitHub repository...
git push -u origin main

echo Done!
pause

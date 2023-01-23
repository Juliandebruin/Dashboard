# Dashboard software

## Table of contents
1. [Installation guide](#Installation)
2. [Dashboard commands](#dashboard-commands)

# Installation

## Install Raspberry Pi OS
Download the [Raspberry pi imager](https://www.raspberrypi.com/software/) on the website. \
Then upload the default Raspberry Pi OS (32-bit) to the SD-card or USB.

## Updating the Raspberry Pi OS
`sudo apt-get update -y`\
`sudo apt-get upgrade -y`

## Configuring the Raspberry Pi
`sudo raspi-config`\
First update the raspi config the turn on the following options:\
1. Enable serial
2. Disable screen saver 
3. Turn on boot to usb if you use one 
4. Reboot the pi if asked

Remove the following part of the first line from /boot/cmdline.txt\
`console=serial0,115200 console=tty1`

The file can be edited with `sudo nano /boot/cmdline.txt`

## Configuring the serial port
If you can not connect to the serial port, you can try the following commands:\
`sudo chmod 666 /dev/ttyS0`

⚠️ chmod 666 gives all rights so this is definitly not a secure way to do this.

## Installing the important packages
`sudo apt-get install git python pip gunicorn chromium -y`

`curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -`\
`sudo apt -y install nodejs`

## Setup git

`git config --global user.name "Username"`\
`git config --global user.email "user@mail.com"`

## Clone the repository
`git clone https://github.com/Juliandebruin/Dashboard.git`

`cd Dashboard`\
`git checkout dev`

## Installing the node modules and the python modules
This will take some time, it will be the fastest when no programs are open on the pi.

`npm install`\
`npm run build`\
`pip install -r requirements.txt`

# Dashboard commands

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
The page will reload if you make edits. 

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## ⚠️ WARNING ⚠️

If you build with the `npm run build` command, the html file will be replace by a generated one.\
This file breaks the css so after each build replace the seccond meta tag with the following line:\
`<meta content="width=device-width; initial-scale=1; maximum-scale=1; user-scalable=0; name=viewport"/>`

### `serve -s build`

This commands runs the build webapplication on a localhost.\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

The files are from the build folder which are also assigned as static files for socketio.

### `npm run serve`

This command runs the application with gunicorn. \
It starts the socketio python server and the react client.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

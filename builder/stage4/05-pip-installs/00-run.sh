#!/bin/bash -e

on_chroot << EOF
pip3 install --upgrade pip


pip3 install dcd-sdk 
pip3 install paho-mqtt 
pip3 install python-dotenv 
pip3 install pyserial 
pip3 install requests 
pip3 install virtualenv

pip3 uninstall jwt
pip3 uninstall pyjwt
pip3 install pyjwt

EOF

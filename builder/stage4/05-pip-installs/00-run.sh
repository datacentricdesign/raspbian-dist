#!/bin/bash -e

on_chroot << EOF
pip3 install --upgrade pip


pip3 install dcd-sdk 
pip3 install paho-mqtt 
pip3 install python-dotenv 
pip3 install pyserial 
pip3 install requests 
pip3 install virtualenv

EOF

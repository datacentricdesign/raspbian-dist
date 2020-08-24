#!/bin/bash

git pull 
sudo rm -rf /data/bucket/dpi/images/*
docker rm -v pigen_*
docker-compose up -d -V --build dpi-api
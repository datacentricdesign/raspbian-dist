#!/bin/bash

git pull 
sudo rm -rf /data/bucket/dpi/images/*
docker container prune 
docker-compose up -d -V --build dpi-api
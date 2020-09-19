#!/bin/bash

git pull 
cd ./builder
docker build -t pi-gen .
cd ..
docker-compose up -d --build
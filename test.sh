#!/bin/bash

git pull 
sudo rm -rf /data/bucket/dpi/images/fdde99a4-d6b0-4bc1-adbf-234f65cfc17a
docker rm -v pigen_fdde99a4-d6b0-4bc1-adbf-234f65cfc17a_work
docker-compose up -d -V --build dpi-api
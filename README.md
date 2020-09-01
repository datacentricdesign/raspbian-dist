# raspbian-dist
Custom raspbian distribution, integrated with dcd-sdk, running custom services. 

## Get started with Docker Compose

1. Create and configure ".env" file like so:

```
HOST_DATA_FOLDER=/absolute/path/to/data/on/host

NODE_ENV=development

# http setup
HTTP_HOST=localhost
HTTP_PORT=8081
HTTP_SECURED=false
HTTP_BASE_URL=/dpi

# default value if not provided in the request body
IMG_NAME=DCDbian
KEYBOARD_LAYOUT="English (US)"
KEYBOARD_KEYMAP="us"
TIMEZONE_DEFAULT=Europe/Amsterdam
ENABLE_SSH=1
LOCALE_DEFAULT="en_US.UTF-8"
```
2. run docker-compose up

3. Postman REST API example in the DPI.postman_collection.json

## Use instructions
* Run from Debian 10 buster / with docker
* Make sure to install dependencies mentioned in the pi-gen repo.
* make sure to install pip `sudo apt-get install python3-pip`
* More details for building in [pi-gen repo](https://github.com/RPi-Distro/pi-gen)

## System Configurations
* System comes with DCD python libraries preinstalled
* Only python3 is available 
* Custom service scripts are preinstalled in */etc/systemd/system/service_scripts/* 
  * python service scripts installed in */etc/systemd/system/service_scripts/python/* 
    * current script sends processor use & ip address to thing token & id found in .env file in stage2 files.
    * currently token & id are non-functional placeholders. 


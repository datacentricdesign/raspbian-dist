# raspbian-dist
Custom raspbian distribution, integrated with dcd-sdk, running custom services. 
Based on [pi-gen repo](https://github.com/RPi-Distro/pi-gen)

## Use instructions
* Run from Debian 10 buster / with docker
* Make sure to install dependencies mentioned in the pi-gen repo.
* make sure to install pip `sudo apt-get install python3-pip`
* More details for building in [pi-gen repo](https://github.com/RPi-Distro/pi-gen)

### Build Instructions ( Docker)
1. Create and configure "config" file like so:
```
IMG_NAME=DCDbian
TARGET_HOSTNAME="pi-netid"
KEYBOARD_LAYOUT="English (US)"
TIMEZONE_DEFAULT=Europe/Amsterdam
FIRST_USER_NAME="netid"
FIRST_USER_PASS="netid_pass"
ENABLE_SSH=1
HOME_ESSID="home_net_name"
HOME_PASSWORD="home_net_pass"
WPA_ESSID=eduroam
WPA_PASSWORD="eduroam_pass"
WPA_COUNTRY=NL
KEYBOARD_KEYMAP="us"
LOCALE_DEFAULT="en_US.UTF-8"
ID="MY_THING_ID"
PRIVATE_KEY="MY_THING_KEY"

```
2. run ./build-docker.sh

## System Configurations
* System comes with DCD python libraries preinstalled
* Only python3 is available 
* Custom service scripts are preinstalled in */etc/systemd/system/service_scripts/* 
  * python service scripts installed in */etc/systemd/system/service_scripts/python/* 
    * current script sends processor use & ip address to thing token & id found in .env file in stage2 files.
    * Currently sets an access key to a thing in /etc/ssl/certs (stage 04/06 python installs) . 

## Operational Information 
* currently deployed on debian server
* only one 1 concurrent build is allowed right now 
* each build takes roughly 1 hour 

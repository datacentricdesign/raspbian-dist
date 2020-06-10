# raspbian-dist
Custom raspbian distribution, integrated with dcd-sdk, running custom services. 

## Use instructions
* Run from Debian 10 buster
* Make sure to install dependencies mentioned in the pi-gen repo.
* make sure to install pip `sudo apt-get install python3-pip`
* More details in [pi-gen repo](https://github.com/RPi-Distro/pi-gen)

* Configure the config file like so:
```
IMG_NAME=DCDbian
TARGET_HOSTNAME="pi_netid"
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

```

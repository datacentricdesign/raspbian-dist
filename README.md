# raspbian-dist
Custom raspbian distribution, integrated with dcd-sdk, running custom services. 

## Use instructions

* Clone the [pi-gen repo](https://github.com/RPi-Distro/pi-gen)
* Replace all stage folders with these ones
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

```

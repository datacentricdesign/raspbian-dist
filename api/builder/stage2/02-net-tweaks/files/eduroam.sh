#!/bin/bash

sudo killall wpa_supplicant
sleep 5
sudo wpa_supplicant -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf -Dwext
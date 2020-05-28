#!/bin/sh -e

magpi_regex="MagPi[[:digit:]]*.pdf"
magpi_loc="$(curl -s https://magpi.raspberrypi.org/latest-pdf)"
magpi_latest="$(echo "$magpi_loc" | grep "$magpi_regex" -m 1 -o)"

if [ ! -f "files/$magpi_latest" ]; then
	find files/ -regextype grep -regex "files/$magpi_regex" -delete
	wget "$magpi_loc" -O "files/$magpi_latest"
fi

file "files/$magpi_latest" | grep -q "PDF document"

install -v -o 1000 -g 1000 -d "${ROOTFS_DIR}/home/${FIRST_USER_NAME}/MagPi"
install -v -o 1000 -g 1000 -m 644 "files/$magpi_latest" "${ROOTFS_DIR}/home/${FIRST_USER_NAME}/MagPi/"



# Install python tools hub dependencies

on_chroot << EOF
python3 -m pip  install --upgrade pip
python3 -m pip install dcd-sdk  --user
python3 -m pip install paho-mqtt  --user
python3 -m pip install python-dotenv  --user
python3 -m pip install pyserial  --user
python3 -m pip install requests  --user

EOF
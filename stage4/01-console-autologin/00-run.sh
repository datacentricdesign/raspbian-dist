#!/bin/bash -e
# B4 for autologin
on_chroot << EOF
	SUDO_USER="${FIRST_USER_NAME}" raspi-config nonint do_boot_behaviour B3
EOF

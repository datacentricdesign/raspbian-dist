#!/bin/bash -e

# place scripts services depend on
install -v -d                          "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python"
install -v -m 755 files/ip.py	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"	
install -v -m 644 files/.env	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"	

# place ip service
install -v -m 644 files/ip.service       "${ROOTFS_DIR}/etc/systemd/system/"


# install python services 
on_chroot << EOF
systemctl enable ip.service

EOF
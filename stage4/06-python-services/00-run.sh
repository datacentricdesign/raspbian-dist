#!/bin/bash -e

# place scripts services depend on
install -v -d                          "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python"
install -v -m 644 files/ip.py	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"	
install -v -m 644 files/.env	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"	

# place ip service
install -v -m 644 files/ip.service       "${ROOTFS_DIR}/etc/systemd/system/"



on_chroot << EOF

# install python services 

EOF
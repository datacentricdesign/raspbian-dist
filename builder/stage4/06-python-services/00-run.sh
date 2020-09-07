#!/bin/bash -e

# place scripts services depend on
mkdir -p "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python"
install -v -d                          "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python"
install -v -m 755 files/ip.py	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"

# update .env file 
cat > files/.env << EOF
THING_ID=dcd:things:${ID}

EOF

install -v -m 644 files/.env	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"	

# create private key 
touch files/dcd:things:${ID}.private.pem

cat > files/dcd:things:${ID}.private.pem << EOF
${PRIVATE_KEY}
EOF

# place private key 
install -v -d                          "${ROOTFS_DIR}/etc/ssl/certs"
install -v -m 644 files/dcd:things:${ID}.private.pem	       "${ROOTFS_DIR}/etc/ssl/certs/"

# run chown
chown root:root   "${ROOTFS_DIR}/etc/ssl/certs/dcd:things:${ID}.private.pem"



# place ip service
install -v -m 644 files/ip.service       "${ROOTFS_DIR}/etc/systemd/system/"

cat > "${ROOTFS_DIR}/etc/systemd/system/ip.service" << EOF
[Unit]
  Description=Automatically send device IP to DCD hub using a python sdk
  Wants=network-online.target
  After=network-online.target

  [Service]

  ExecStart=/usr/bin/python3.7 /etc/systemd/system/service_scripts/python/ip.py
  StandardOutput=syslog 
  StandardError=syslog 
  Restart=always
  RestartSec=10
  User=${FIRST_USER_NAME}

  [Install]
  WantedBy=multi-user.target
EOF



# install python services 
on_chroot << EOF
systemctl enable ip.service

EOF

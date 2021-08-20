#!/bin/bash -e

# place scripts services depend on
mkdir -p "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python"
install -v -d                          "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python"
install -v -m 755 files/ip.py	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"

# update .env file 
cat > files/.env << EOF
THING_ID=dcd:things:${ID}
PRIVATE_KEY_PATH=/etc/ssl/certs/dcd:things:${ID}.private.pem
LOG_PATH=/var/log/dcd/
HTTP_API_URI=https://${BUCKET_HOST}:443/bucket/api
MQTT_HOST=${BUCKET_HOST}
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

# log folder
mkdir -p "${ROOTFS_DIR}/var/log/dcd"
chown root:root "${ROOTFS_DIR}/var/log/dcd"
chmod 777 -R "${ROOTFS_DIR}/var/log/dcd"

# data folder in tmp
mkdir -p "${ROOTFS_DIR}/tmp/dcd"
chown root:root "${ROOTFS_DIR}/tmp/dcd"
chmod 777 -R "${ROOTFS_DIR}/tmp/dcd"

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
  Environment="DIGI_CERT_CA=/tmp/dcd/DigiCertCA.crt"
  Environment="DATA_PATH=/tmp/dcd"

  [Install]
  WantedBy=multi-user.target
EOF



# install python services 
on_chroot << EOF
systemctl enable ip.service

EOF

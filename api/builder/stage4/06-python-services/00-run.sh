#!/bin/bash -e

# place scripts services depend on
install -v -d                          "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python"
install -v -m 755 files/ip.py	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"

# update .env file 
cat > files/.env << EOF
THING_ID=dcd:things:${ID}

EOF

install -v -m 644 files/.env	       "${ROOTFS_DIR}/etc/systemd/system/service_scripts/python/"	

# create private key 
touch files/${ID}.private.pem

cat > files/${ID}.private.pem << EOF
${PRIVATE_KEY}
EOF

# place private key 
install -v -d                          "${ROOTFS_DIR}/etc/ssl/certs"
install -v -m 644 files/${ID}.private.pem	       "${ROOTFS_DIR}/etc/ssl/certs/"

# run chown
on_chroot << EOF
chown root:root /etc/ssl/certs/${ID.private.pem}
EOF


# place ip service
install -v -m 644 files/ip.service       "${ROOTFS_DIR}/etc/systemd/system/"


# install python services 
on_chroot << EOF
systemctl enable ip.service

EOF

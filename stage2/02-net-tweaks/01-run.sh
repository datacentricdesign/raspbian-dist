#!/bin/bash -e

install -v -d                             "${ROOTFS_DIR}/etc/systemd/system/dhcpcd.service.d"
install -v -m 644 files/wait.conf         "${ROOTFS_DIR}/etc/systemd/system/dhcpcd.service.d/"

install -v -d                             "${ROOTFS_DIR}/etc/wpa_supplicant"
install -v -m 600 files/wpa_supplicant.conf      "${ROOTFS_DIR}/etc/wpa_supplicant/"


install -v -d                             "${ROOTFS_DIR}/etc/systemd/system/wpa_supplicant@.service.d"
install -v -m 644 files/wext.conf	       "${ROOTFS_DIR}/etc/systemd/system/wpa_supplicant@.service.d/"	


# if [ -v WPA_COUNTRY ]; then
#  echo "country=${WPA_COUNTRY}" >> "${ROOTFS_DIR}/etc/wpa_supplicant/wpa_supplicant.conf"
# fi


if [ -v WPA_ESSID ] && [ -v WPA_PASSWORD ]; then
HASH=$(echo -n ${WPA_PASSWORD} | iconv -t UTF-16LE | openssl md4  -binary | xxd -p)
cat >> "${ROOTFS_DIR}/etc/wpa_supplicant/wpa_supplicant.conf" << EOL

network={
       ssid="${WPA_ESSID}"
       priority=10
       proto=WPA RSN
       key_mgmt=WPA-EAP
       pairwise=CCMP TKIP
       auth_alg=OPEN
       eap=PEAP
       phase1="peaplabel=0"
       phase2="auth=MSCHAPV2"
       identity="${FIRST_USER_NAME}@tudelft.nl"
       password=hash:${HASH}
       
}

network={
       ssid="${WPA_ESSID}"
       key_mgmt=NONE
}

EOL
fi


if [ -v HOME_ESSID] && [ -v HOME_PASSWORD ]; then
HASH=$(echo -n ${HOME_PASSWORD} | iconv -t UTF-16LE | openssl md4  -binary | xxd -p)

cat >> "${ROOTFS_DIR}/etc/wpa_supplicant/wpa_supplicant.conf" << EOL

network={
       ssid="${HOME_ESSID}"
       password=hash:${HASH}
}


EOL
fi

# Disable wifi on 5GHz models
mkdir -p "${ROOTFS_DIR}/var/lib/systemd/rfkill/"
echo 1 > "${ROOTFS_DIR}/var/lib/systemd/rfkill/platform-3f300000.mmcnr:wlan"
echo 1 > "${ROOTFS_DIR}/var/lib/systemd/rfkill/platform-fe300000.mmcnr:wlan"


FROM i386/debian:buster
#FROM debian:buster

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -y update && \
    apt-get -y install --no-install-recommends \
        git vim parted \
        wpasupplicant openssl \
        quilt coreutils qemu-user-static debootstrap zerofree zip dosfstools \
        bsdtar libcap2-bin rsync grep udev xz-utils curl xxd file kmod bc\
        binfmt-support ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Use the proxy in the container, not at building time because the cacher is not on the same network
# RUN  echo 'Acquire::http { Proxy "http://apt-cacher-ng:3142"; };' >> /etc/apt/apt.conf.d/01proxy

RUN dpkg-reconfigure qemu-user-static

WORKDIR /pi-gen
COPY . .

VOLUME [ "/pi-gen/work", "/pi-gen/deploy"]

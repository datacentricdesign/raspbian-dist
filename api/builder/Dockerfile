FROM debian:buster

ENV DEBIAN_FRONTEND noninteractive

# RUN  echo 'Acquire::http { Proxy "http://apt-cacher-ng:3142"; };' >> /etc/apt/apt.conf.d/01proxy

RUN apt-get -y update && \
    apt-get -y install --no-install-recommends \
        git vim parted \
        quilt coreutils qemu-user-static debootstrap zerofree zip dosfstools \
        bsdtar libcap2-bin rsync grep udev xz-utils curl xxd file kmod bc\
        binfmt-support ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY . /pi-gen/

RUN echo "# # # # # list file pi-gen"
RUN echo $(ls /pi-gen)

VOLUME [ "/pi-gen/work", "/pi-gen/deploy"]

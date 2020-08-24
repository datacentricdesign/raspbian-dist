#!/bin/bash -eu



DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# create dir for user thing id image
REQ_DIR="$( mkdir -p $2/$1 && echo "$2/$1" )"

# create status file 
touch $2/$1/status.json && echo "{\"code\": 1, \"message\":\"Starting ${IMG_NAME} generation for 'dcd:things:$1'.\"}" > $2/$1/status.json


BUILD_OPTS="$*"

DOCKER="docker"

if ! ${DOCKER} ps >/dev/null 2>&1; then
	DOCKER="sudo docker"
fi
if ! ${DOCKER} ps >/dev/null; then
	echo "error connecting to docker:"
	${DOCKER} ps
	exit 1
fi

CONFIG_FILE=""
if [ -f "${REQ_DIR}/.env" ]; then
	CONFIG_FILE="${REQ_DIR}/.env"
fi

while getopts "c:" flag
do
	case "${flag}" in
		c)
			CONFIG_FILE="${OPTARG}"
			;;
		*)
			;;
	esac
done

echo "The config file path: $CONFIG_FILE"

# Ensure that the configuration file is an absolute path
if test -x /usr/bin/realpath; then
	CONFIG_FILE=$(realpath -s "$CONFIG_FILE" || realpath "$CONFIG_FILE")
fi

# Ensure that the confguration file is present
if test -z "${CONFIG_FILE}"; then
	echo "Configuration file need to be present in '${REQ_DIR}/config' or path passed as parameter"
	exit 1
else
	# shellcheck disable=SC1090
	source ${CONFIG_FILE}
fi


CONTAINER_NAME=${CONTAINER_NAME:-pigen_$1_work}

CONTINUE=${CONTINUE:-0}
PRESERVE_CONTAINER=${PRESERVE_CONTAINER:-0}

if [ -z "${IMG_NAME}" ]; then
	echo "IMG_NAME not set in 'config'" 1>&2
	echo 1>&2
exit 1
fi

# Ensure the Git Hash is recorded before entering the docker container
# GIT_HASH=${GIT_HASH:-"$(git rev-parse HEAD)"}
GIT_HASH="06eb0e4514b75fbc367ec036a15e6d1c10315b49"

CONTAINER_EXISTS=$(${DOCKER} ps -a --filter name="${CONTAINER_NAME}" -q)
CONTAINER_RUNNING=$(${DOCKER} ps --filter name="${CONTAINER_NAME}" -q)
if [ "${CONTAINER_RUNNING}" != "" ]; then
	echo "The build is already running in container ${CONTAINER_NAME}. Aborting."
	exit 1
fi
if [ "${CONTAINER_EXISTS}" != "" ] && [ "${CONTINUE}" != "1" ]; then
	echo "Container ${CONTAINER_NAME} already exists and you did not specify CONTINUE=1. Aborting."
	echo "You can delete the existing container like this:"
	echo "  ${DOCKER} rm -v ${CONTAINER_NAME}"
	exit 1
fi

# Modify original build-options to allow config file to be mounted in the docker container
BUILD_OPTS="$(echo "${BUILD_OPTS:-}" | sed -E 's@\-c\s?([^ ]+)@-c /.env@')"
BUILD_OPTS="-c /config"

echo $(ls)

${DOCKER} build -t pi-gen "${DIR}"
if [ "${CONTAINER_EXISTS}" != "" ]; then
	trap 'echo "got CTRL+C... please wait 5s" && ${DOCKER} stop -t 5 ${CONTAINER_NAME}_cont' SIGINT SIGTERM
	time ${DOCKER} run --rm --privileged \
		--volume ${CONFIG_FILE}:/config:ro \
		-e "GIT_HASH=${GIT_HASH}" \
		--volumes-from="${CONTAINER_NAME}" --name "${CONTAINER_NAME}_cont" \
		--volume "$2/$1/status.json":/status.json \
		pi-gen \
		bash -e -o pipefail -c "echo $(ls) && dpkg-reconfigure qemu-user-static &&
	cd /pi-gen; ./build.sh ${BUILD_OPTS} &&
	rsync -av work/*/build.log deploy/" &
	wait "$!"
else
	trap 'echo "got CTRL+C... please wait 5s" && ${DOCKER} stop -t 5 ${CONTAINER_NAME}' SIGINT SIGTERM
	time ${DOCKER} run --name "${CONTAINER_NAME}" --privileged \
		--volume "${CONFIG_FILE}":/config:ro \
		--volume "$2/$1/status.json":/status.json \
		-e "GIT_HASH=${GIT_HASH}" \
		pi-gen \
		bash -e -o pipefail -c "echo $(ls) && dpkg-reconfigure qemu-user-static &&
	cd /pi-gen; ./build.sh ${BUILD_OPTS} &&
	rsync -av work/*/build.log deploy/" &
	wait "$!"
fi
echo "copying results from deploy/"
${DOCKER} cp "${CONTAINER_NAME}":/pi-gen/deploy $2/$1
ls -lah $2/$1

# cleanup
if [ "${PRESERVE_CONTAINER}" != "1" ]; then
	${DOCKER} rm -v "${CONTAINER_NAME}"
fi

echo "{\"code\": 0, \"message\":\"The ${IMG_NAME} for 'dcd:things:$1' is ready.\"}" > $2/$1/status.json
#!/bin/bash 

MAX_RUNNING_BUILDS=1							# How many builds at the same time
SEARCH_LOCATION=$HOST_DATA_FOLDER/images/*		# Where to find images 
FREQUENCY=60									# Frequency of running this script (seconds)

# simple process scheduler with limiter arguments 

while :
do
  PENDING_BUILDS=0
  RUNNING_BUILDS=0
  DONE_BUILDS=0
  FAILED_BUILDS=0

	find $SEARCH_LOCATION  -type d -maxdepth 0 | ( while read -r line ; do
	# for each directory, check if status is empty
	if [[ -s ${line}/status ]]; 
		# the script has been executed because the status file  is not empty
		then 
			if [ ! -z "$(cat ${line}/status	| grep -x "done")" ]
			then
				# this image has been generated
				let DONE_BUILDS++;

			elif [ ! -z "$(cat ${line}/status	| grep -x "failure")" ]
			then
				# this image has failed
				let FAILED_BUILDS++;

			else
				# this image is being built
				let RUNNING_BUILDS++;

			fi
		# status is empty so not run yet
		else
			let PENDING_BUILDS++;
	fi

	
	done
	echo "{\"running\": ${RUNNING_BUILDS}, \"pending\": $PENDING_BUILDS, \"done\": $DONE_BUILDS, \"failed\": $FAILED_BUILDS}" > $HOST_DATA_FOLDER/scheduler.log

	if [ $RUNNING_BUILDS -lt $MAX_RUNNING_BUILDS ]
	then
		# echo "Can run another script"
		find $SEARCH_LOCATION  -type d -maxdepth 0  |  while read -r line ; do
			# for each directory, check if status is empty
			if ! [[ -s ${line}/status ]]; 
				# the status is empty, so it has not run yet
				then 
					echo "Starting building ${line}";
					# TODO ADD PROPER SCRIPT AND CONFIG LOCATION
					bash /build-docker.sh $(basename "$line") $HOST_DATA_FOLDER/images > $line/build.log & # run in background
					break
			fi
		done
	fi
	)

  # Run the this script every minute
  sleep $FREQUENCY

done

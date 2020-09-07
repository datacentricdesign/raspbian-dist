#!/bin/bash 





MAX_RUNNING_BUILDS=2

SEARCH_LOCATION=$HOST_DATA_FOLDER/images/*

# simple process scheduler with limiter arguments 

while :
do
  PENDING_BUILDS=0
  RUNNING_BUILDS=0
  DONE_BUILDS=0

#   echo "Press <CTRL+C> to exit."

	  find $SEARCH_LOCATION  -type d | ( while read -r line ; do
		# for each directory  
	  	# check if status is empty

	  	if [[ -s ${line}/status ]]; 
	  		# script has been executed echo "file  ${line}/status has something"; 
		  	then 
				if [ -z "$(cat ${line}/status	| grep -x "done")" ]
				then
					   # this image is being built 
				    #   echo "${line}/status is NOT done"
				      let RUNNING_BUILDS++;

				else
					  # this image has been generated
				    #   echo "${line}/status is done"
				      let DONE_BUILDS++;
				fi
				#CONTENT=$(cat ${line}/status	| grep "done")
				#echo ${CONTENT}
			# status is empty so not run yet
			else
				# echo "file ${line}/status is empty"; 
				let PENDING_BUILDS++;
	  	fi

	  
	  done
	    echo "Running: ${RUNNING_BUILDS} Pending: $PENDING_BUILDS Done: $DONE_BUILDS"

		if [ $RUNNING_BUILDS -lt $MAX_RUNNING_BUILDS ]
		then
		#   echo "Can run another script"
		  find $SEARCH_LOCATION  -type d  |  while read -r line ; do
				# for each directory  
			  	# check if status is empty
		 
			  	if ! [[ -s ${line}/status ]]; 
					# status is empty so not run yet
					then 
						 echo "execute ${line}/status";
						 # TO DO ADD PROPER SCRIPT AND CONFIG LOCATION
						 bash /build-docker.sh $(basename "$line") $HOST_DATA_FOLDER/images > $line/build.log & # run in background
						 break
			  	fi
			  	#echo $line
			  
		 done

		# else 
		#   echo "Cannot run another script"
		fi
	  ) 

  # every minute
  sleep 5

 
done

#!/bin/bash 





MAX_RUNNING_BUILDS=2
# TO DO LOCATION WHERE IT CAN SEARCH FOR 
SEARCH_LOCATION="."

# simple process scheduler with limiter arguments 

while :
do
  PENDING_BUILDS=0
  RUNNING_BUILDS=0
  DONE_BUILDS=0

  echo "Press <CTRL+C> to exit."

	  find .  -type d -not -name $SEARCH_LOCATION | ( while read -r line ; do
		# for each directory  
	  	# check if status is empty
 
	  	if [[ -s ${line}/status ]]; 
	  		# script has been executed echo "file  ${line}/status has something"; 
		  	then 
				if [ -z "$(cat ${line}/status	| grep -x "done")" ]
				then
					   # this image is being built 
				      echo "${line}/status is NOT done"
				      let RUNNING_BUILDS++;

				else
					  # this image has been generated
				      echo "${line}/status is done"
				      let DONE_BUILDS++;
				fi
				#CONTENT=$(cat ${line}/status	| grep "done")
				#echo ${CONTENT}
			# status is empty so not run yet
			else echo "file ${line}/status is empty"; 
				let PENDING_BUILDS++;
	  	fi
	  	#echo $line

	  
	  done
	    echo $RUNNING_BUILDS
		echo $PENDING_BUILDS
		echo $DONE_BUILDS

		if [ $RUNNING_BUILDS -lt $MAX_RUNNING_BUILDS ]
		then
		  echo "Can run another script"
		  find .  -type d -not -name $SEARCH_LOCATION |  while read -r line ; do
				# for each directory  
			  	# check if status is empty
		 
			  	if ! [[ -s ${line}/status ]]; 
					# status is empty so not run yet
					then 
						 echo "execute ${line}/status"; 
						 # TO DO ADD PROPER SCRIPT AND CONFIG LOCATION
						 sh build_docker.sh /PASS/TWO/PARAMS & # run in background
						
			  	fi
			  	#echo $line

			  
		 done

		else 
		  echo "Cannot run another script"
		fi
	  ) 

  # every minute
  sleep 5

 
done

import os

from dcd.bucket.thing import Thing
from time import sleep

last_cpu = 0
last_disk_used = 0
last_disk_available = 0
last_disk_use = 0

# Instantiate a thing with its credential
thing = Thing()

# Find or create a property to store processor usage
property_cpu = thing.find_or_create_property("Processor Usage", "CPU")
property_disk = thing.find_or_create_property("Disk Usage", "DISK_USAGE")

def update_cpu():
    f = os.popen('top -bn1 | grep "Cpu" | cut -c 10-13')
    cpu = float(f.read().strip())
    global last_cpu
    if cpu != last_cpu:
        property_cpu.update_values((cpu,))
        last_cpu = cpu

def update_disk():
    f = os.popen('df -h | grep "/dev/root"')
    line = f.read()
    used = line[22:26]
    if used.endswith("G"):
       used = float(used[0:3])*1000
    else:
       used = float(used[0:3])
    available = line[28:32]
    if available.endswith("G"):
       available = float(available[0:3])*1000
    else:
       available = float(available[0:3])
    use = float(line[33:36])

    global last_disk_used
    global last_disk_available
    global last_disk_use

   
    if used != last_disk_used or available != last_disk_available or use != last_disk_use:
        property_disk.update_values((used,available,use))
        last_disk_used = used
        last_disk_available = available
        last_disk_use = use

while True:
    update_cpu()
    update_disk()
    # sleep every 5 seconds
    sleep(5)

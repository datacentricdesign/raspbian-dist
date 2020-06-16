from dotenv import load_dotenv
import os

from dcd.entities.thing import Thing
from dcd.entities.property import PropertyType
from time import sleep

# The thing ID and access token
load_dotenv()
THING_ID = os.environ['THING_ID']
THING_TOKEN = os.environ['THING_TOKEN']

# Instantiate a thing with its credential
my_thing = Thing(thing_id=THING_ID, token=THING_TOKEN)

# We can fetch the details of our thing
my_thing.read()
my_property = my_thing.find_or_create_property("IP Address", PropertyType.TEXT)
my_property_cpu = my_thing.find_or_create_property("Processor Usage", PropertyType.TEXT)

def update_ip():
    f = os.popen('ifconfig wlan0 | grep "inet " | cut -d " " -f10')
    ip = f.read()
    my_property.update_values((ip.rstrip(),))


def update_cpu():
	f = os.popen('top -bn1 | grep "Cpu" | cut -c 10-13')
	cpu = f.read()
    my_property_cpu.update_values((cpu.rstrip(),))	


update_ip()

while true:
	update_cpu()
	# sleep every 60 seconds
	time.sleep(60)
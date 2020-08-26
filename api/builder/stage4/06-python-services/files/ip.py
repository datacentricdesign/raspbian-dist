from dotenv import load_dotenv
import os

from dcd.entities.thing import Thing
from time import sleep

# The thing ID and access token
load_dotenv()
THING_ID = os.environ['THING_ID']

# Instantiate a thing with its credential
my_thing = Thing(thing_id=THING_ID, private_key_path="/etc/ssl/certs/" + THING_ID + "private.pem")

# Find or create a property to store processor usage
my_property_cpu = my_thing.find_or_create_property("Processor Usage", "CPU")

def update_cpu():
	f = os.popen('top -bn1 | grep "Cpu" | cut -c 10-13')
	cpu = f.read()
	my_property_cpu.update_values((cpu.rstrip(),))	

while True:
	update_cpu()
	# sleep every 60 seconds
	time.sleep(60)
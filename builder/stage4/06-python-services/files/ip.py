import os

from dcd.bucket.thing import Thing
from time import sleep

# Instantiate a thing with its credential
my_thing = Thing()

# Find or create a property to store processor usage
my_property_cpu = my_thing.find_or_create_property("Processor Usage", "CPU")


def update_cpu():
    f = os.popen('top -bn1 | grep "Cpu" | cut -c 10-13')
    cpu = f.read()
    my_property_cpu.update_values((cpu.rstrip(),))


while True:
    update_cpu()
    # sleep every 5 seconds
    sleep(5)

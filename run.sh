#!/bin/bash

clear
sudo python scrape.py mon0 & 
sudo python scrape.py mon1 & 
sudo python scrape.py mon2 &
read yo
sudo pkill $(pgrep python)

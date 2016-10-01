#!/bin/sh

echo "Please enter your physical device name phy[x]"
read DEVICE
echo "Please enter your wireless interface name (wlan0, wlp3s0)"
read WIFI_INTERFACE

sudo airmon-ng check kill
sudo iw phy $DEVICE interface add mon0 type monitor
sudo iw phy $DEVICE interface add mon1 type monitor
sudo iw phy $DEVICE interface add mon2 type monitor

sudo iw dev mon0 set type monitor
sudo iw dev mon1 set type monitor
sudo iw dev mon2 set type monitor

sudo ifconfig mon0 up
sudo ifconfig mon1 up
sudo ifconfig mon2 up

sudo ifconfig $WIFI_INTERFACE down

sudo iw dev mon0 set channel 1
sudo iw dev mon1 set channel 6
sudo iw dev mon2 set channel 11

sudo ifconfig $WIFI_INTERFACE up

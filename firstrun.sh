#!/bin/bash
# This is a one time run file, setting everything necessary up.
sudo apt update && sudo apt upgrade -y
sudo apt install git python3-dev python3-pip sqlite3 -y
pip install datetime
sudo timedatectl set-timezone Europe/Berlin
sudo raspi-config nonint do_i2c 0

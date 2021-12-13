#!/bin/bash
# This is a one time run file, setting everything necessary up.
sudo apt update && sudo apt upgrade -y
sudo apt install git python3-dev python3-pip sqlite3 -y
<<<<<<< HEAD
pip install datetime apscheduler pyserial
sudo timedatectl set-timezone Europe/Berlin
=======
pip install datetime apscheduler flask 
sudo timedatectl set-timezone Europe/Berlin
sudo usermod -a -G dialout,gpio $USER
>>>>>>> 18548eff39a90670af98087a25453ef0cd13d0d5

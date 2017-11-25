#!/bin/sh
set -e
# see: https://github.com/zapty/forever-service
sudo su $user << BASH
    npm install -g forever
    npm install -g forever-service
    sudo forever-service install Plabutschor --start --script $(pwd)/index.js
BASH
echo 'Hint: Add your email addresses for receiving alerts to mail.list'

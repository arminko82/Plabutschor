#!/bin/sh
set -e
# see: https://github.com/zapty/forever-service
sudo su $user << BASH
    if [ "$1" = "with-npm" ]
    then
        npm install -g forever
        npm install -g forever-service
    fi
    forever-service install Plabutschor --script index.js
BASH
echo 'Hint: Add your email addresses for receiving alerts to mail.list'

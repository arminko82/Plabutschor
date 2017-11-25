#!/bin/sh

# see: https://github.com/zapty/forever-service
sudo su $user << BASH
    sudo forever-service delete Plabutschor
BASH

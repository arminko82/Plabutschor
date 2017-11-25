#!/bin/sh

# see: https://github.com/zapty/forever-service
sudo su $user << BASH
    forever-service delete Plabutschor
BASH

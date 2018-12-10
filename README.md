# Plabutschor

[![Build Status](https://travis-ci.com/arminko82/Plabutschor.svg?branch=master)](https://travis-ci.com/arminko82/Plabutschor)

A node.js based service periodically checking for the status of passableness of the tunnel "Plabutsch" below Graz.
In the end this package shall be installed on a RasPi in order to give a audio signal in case the tunnel is closed.
The checks shall only be performed on certain days at certain hours.

Spoken output is the defined form to report problems. Therefor espeak (http://espeak.sourceforge.net/) has been installed which is executed as child process.


I wanted to use this but could not be installed by npm on raspian: https://www.npmjs.com/package/node-espeak

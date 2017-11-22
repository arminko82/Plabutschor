#!/bin/sh

# https://www.npmjs.com/package/forever should be installed before by
# => npm i forever -g

forever start index.js
echo 'Hint: Add your email addresses for receiving alerts to mail.list'

#!/bin/bash

# replace the user with the Travis root user
sed -i -e "s/.*user.*/user: 'root',/" secret/index-sample.mjs
sed -i -e "s/.*password.*/password: '',/" secret/index-sample.mjs
cp secret/index-sample.mjs secret/index.mjs

# database migrations
npm run knex -- migrate:latest

# get sample midis (13Kb)
curl http://www.jsbach.net/midi/sankey/802-805.zip --output sample.zip
unzip sample.zip -d midi-samples

# import the samples
node -r @babel/register tools/import.mjs midi-samples/

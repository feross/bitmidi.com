#!/bin/sh
# Update code and restart server (run on server)
set -e

if [ -d "/home/feross/www/build-bitmidi.com" ]; then
  echo "ERROR: Build folder exists. Is another build in progress?"
  exit 1
fi

if [ -d "/home/feross/www/old-bitmidi.com" ]; then
  echo "ERROR: Old folder exists. Did a previous build crash?"
  exit 1
fi

cp -R /home/feross/www/bitmidi.com /home/feross/www/build-bitmidi.com

cd /home/feross/www/build-bitmidi.com && git pull
cd /home/feross/www/build-bitmidi.com && rm -rf node_modules
cd /home/feross/www/build-bitmidi.com && npm ci --no-progress
cd /home/feross/www/build-bitmidi.com && npm run build
cd /home/feross/www/build-bitmidi.com && npm prune --production --no-progress

sudo supervisorctl stop bitmidi:

cd /home/feross/www && mv bitmidi.com old-bitmidi.com
cd /home/feross/www && mv build-bitmidi.com bitmidi.com

sudo supervisorctl start bitmidi:

cd /home/feross/www && rm -rf old-bitmidi.com

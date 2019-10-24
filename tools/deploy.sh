#!/bin/sh
# Update code and restart server (run from app server)
set -e

if [ -d "/home/feross/www/bitmidi.com-build" ]; then
  echo "ERROR: Build folder exists. Is another build in progress?"
  exit 1
fi

if [ -d "/home/feross/www/bitmidi.com-old" ]; then
  echo "ERROR: Old folder exists. Did a previous build crash?"
  exit 1
fi

cp -R /home/feross/www/bitmidi.com /home/feross/www/bitmidi.com-build

cd /home/feross/www/bitmidi.com-build && git pull
cd /home/feross/www/bitmidi.com-build && rm -rf node_modules
cd /home/feross/www/bitmidi.com-build && npm install --no-progress
cd /home/feross/www/bitmidi.com-build && npm run build
cd /home/feross/www/bitmidi.com-build && npm prune --production

sudo supervisorctl stop bitmidi:

# Move build folder into place (while app is stopped)
cd /home/feross/www && mv bitmidi.com bitmidi.com-old
cd /home/feross/www && mv bitmidi.com-build bitmidi.com

sudo supervisorctl start bitmidi:

# Remove old files (after app has started)
cd /home/feross/www && rm -rf bitmidi.com-old

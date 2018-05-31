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
cd /home/feross/www/bitmidi.com-build && npm install
cd /home/feross/www/bitmidi.com-build && npm run build
cd /home/feross/www/bitmidi.com-build && npm prune --production

# HACK HACK HACK HACK HACK - fix package-lock.json getting updated when 'npm install'
# is run. This happens when package.json and package-lock.json are out of sync,
# and happens anytime a Greenkeeper PR is merged, for instance.
cd /home/feross/www/bitmidi.com-build && git checkout .

cd /home/feross/www && rm -rf bitmidi.com-build/db

sudo supervisorctl stop bitmidi

# Move database files (while app is stopped)
cd /home/feross/www && mv bitmidi.com/db bitmidi.com-build/db

# Move build folder into place (while app is stopped)
cd /home/feross/www && mv bitmidi.com bitmidi.com-old
cd /home/feross/www && mv bitmidi.com-build bitmidi.com

sudo supervisorctl start bitmidi

# Remove old files (after app has started)
cd /home/feross/www && rm -rf bitmidi.com-old

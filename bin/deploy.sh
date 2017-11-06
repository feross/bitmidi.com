#!/bin/sh
# Update code and restart server (run from app server)
set -e

if [ -d "/home/feross/www/nodefoo.com-build" ]; then
  echo "ERROR: Build folder exists. Is another build in progress?"
  exit 1
fi

if [ -d "/home/feross/www/nodefoo.com-old" ]; then
  echo "ERROR: Old folder exists. Did a previous build crash?"
  exit 1
fi

cp -R /home/feross/www/nodefoo.com /home/feross/www/nodefoo.com-build

cd /home/feross/www/nodefoo.com-build && git pull
cd /home/feross/www/nodefoo.com-build && rm -rf node_modules
cd /home/feross/www/nodefoo.com-build && npm install
cd /home/feross/www/nodefoo.com-build && npm run build
cd /home/feross/www/nodefoo.com-build && npm prune --production

cd /home/feross/www && rm -rf nodefoo.com-build/db

sudo supervisorctl stop nodefoo

# Move database files (while app is stopped)
cd /home/feross/www && mv nodefoo.com/db nodefoo.com-build/db

# Move build folder into place (while app is stopped)
cd /home/feross/www && mv nodefoo.com nodefoo.com-old
cd /home/feross/www && mv nodefoo.com-build nodefoo.com

sudo supervisorctl start nodefoo

# Remove old files (after app has started)
cd /home/feross/www && rm -rf nodefoo.com-old

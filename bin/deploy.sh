#!/bin/sh
# Update code and restart server (run from app server)
set -e

if [ -d "/home/feross/www/nodefoo.com-build" ]; then
  echo "ERROR: Build folder already exists. Is another build in progress?"
  exit 1
fi

cp -R /home/feross/www/nodefoo.com /home/feross/www/nodefoo.com-build

cd /home/feross/www/nodefoo.com-build && git pull
cd /home/feross/www/nodefoo.com-build && rm -rf node_modules
cd /home/feross/www/nodefoo.com-build && npm install
cd /home/feross/www/nodefoo.com-build && npm run build
cd /home/feross/www/nodefoo.com-build && npm prune --production

sudo supervisorctl stop play

# Move database files (while app is stopped)
cd /home/feross/www && rm -rf nodefoo.com-build/db
cd /home/feross/www && mv nodefoo.com/db nodefoo.com-build/db

cd /home/feross/www && mv nodefoo.com nodefoo.com-old
cd /home/feross/www && mv nodefoo.com-build nodefoo.com

sudo supervisorctl start play

cd /home/feross/www && rm -rf nodefoo.com-old

FULL_PATH=`realpath ${BASH_SOURCE[0]}`
DEPLOY_DIR="$(dirname "$FULL_PATH")"
ROOT_DIR="$(dirname "$DEPLOY_DIR")"
SRC_DIR="$ROOT_DIR/src"

# install packages
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs python3-pip python-imaging nginx letsencrypt
sudo pip3 install -r $DEPLOY_DIR/requirements.txt
sudo npm install pm2 -g

# npm install with limited memory
node --max_semi_space_size=1 --max_old_space_size=650 --max_executable_size=150 /usr/bin/npm install

# cp secrets
cp "$SRC_DIR/secrets.sample.js" "$SRC_DIR/secrets.js"
nano "$SRC_DIR/secrets.js"
nano "$SRC_DIR/config.js"

# build and install project
node --max_semi_space_size=1 --max_old_space_size=650 --max_executable_size=150 /usr/bin/npm run build -- --release
pm2 start "$DEPLOY_DIR/ecosystem.config.js"
sudo ln -s "$DEPLOY_DIR/nginx.conf" "/etc/nginx/sites-enabled/ia-cp.org"

# install cronjobs
cronjobs=`cat "$DEPLOY_DIR/cronjobs"`
cronjobs=${cronjobs/USERNAME/$USER}
echo "$cronjobs" | sudo tee "/etc/cron.d/iacp" > /dev/null

# SSL certificates
sudo letsencrypt certonly --webroot -w $DEPLOY_DIR -d ia-cp.org

# restart nginx
sudo service nginx restart

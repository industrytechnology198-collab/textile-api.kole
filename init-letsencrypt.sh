#!/bin/bash

# Run this ONCE on your VPS before starting the full stack.
# It gets your SSL certificate from Let's Encrypt.

DOMAIN="apitextile.kole.be"
EMAIL="your-email@example.com"   # <-- change this to your real email

# Directories
mkdir -p ./nginx/certbot/conf
mkdir -p ./nginx/certbot/www
mkdir -p ./nginx/conf

# Download recommended TLS parameters
if [ ! -e "./nginx/certbot/conf/options-ssl-nginx.conf" ]; then
  echo "Downloading recommended TLS parameters..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    > ./nginx/certbot/conf/options-ssl-nginx.conf
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
    > ./nginx/certbot/conf/ssl-dhparams.pem
fi

# Temporarily use a dummy cert so Nginx can start
echo "Creating dummy certificate for $DOMAIN..."
mkdir -p ./nginx/certbot/conf/live/$DOMAIN
docker run --rm \
  -v "$(pwd)/nginx/certbot/conf:/etc/letsencrypt" \
  certbot/certbot \
  certonly --standalone \
  --preferred-challenges http \
  -d $DOMAIN \
  --register-unsafely-without-email \
  --agree-tos \
  --force-renewal \
  --staging 2>/dev/null || true

# Start only Nginx + Certbot first
echo "Starting Nginx..."
docker compose up -d nginx certbot

# Wait for Nginx
sleep 5

# Get the real certificate
echo "Requesting real SSL certificate for $DOMAIN..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  --force-renewal

# Reload Nginx with real cert
docker compose exec nginx nginx -s reload

echo ""
echo "SSL certificate obtained successfully for $DOMAIN"
echo "Now start the full stack: docker compose up -d"

#!/bin/bash

# SSL Certificate Setup Script for EC2
# This script helps setup Let's Encrypt SSL certificates

set -e

echo "🔐 SSL Certificate Setup Script"
echo "================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "⚠️  This script needs to be run with sudo"
  echo "Usage: sudo ./setup-ssl.sh yourdomain.com"
  exit 1
fi

# Check if domain provided
if [ -z "$1" ]; then
  echo "⚠️  Please provide your domain name"
  echo "Usage: sudo ./setup-ssl.sh yourdomain.com"
  exit 1
fi

DOMAIN=$1
APP_DIR=$(pwd)
CERT_DIR="$APP_DIR/server/certs"

echo "Domain: $DOMAIN"
echo "App Directory: $APP_DIR"
echo ""

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
  echo "📦 Installing Certbot..."
  apt update
  apt install -y certbot
fi

# Stop any service using port 80
echo "🛑 Stopping services on port 80..."
lsof -ti:80 | xargs kill -9 2>/dev/null || true

# Get certificate
echo "🔒 Obtaining SSL certificate from Let's Encrypt..."
certbot certonly --standalone \
  -d $DOMAIN \
  --non-interactive \
  --agree-tos \
  --email admin@$DOMAIN \
  --preferred-challenges http

if [ $? -ne 0 ]; then
  echo "❌ Failed to obtain certificate"
  exit 1
fi

# Create certs directory
echo "📁 Creating certificates directory..."
mkdir -p "$CERT_DIR"

# Copy certificates
echo "📋 Copying certificates to application..."
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem "$CERT_DIR/"
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem "$CERT_DIR/"

# Get the actual user (since script is run with sudo)
ACTUAL_USER=${SUDO_USER:-$USER}

# Change ownership
echo "🔑 Setting permissions..."
chown -R $ACTUAL_USER:$ACTUAL_USER "$CERT_DIR"
chmod 600 "$CERT_DIR"/*

# Create renewal script
echo "🔄 Setting up auto-renewal..."
cat > /usr/local/bin/renew-ssl.sh << EOF
#!/bin/bash
certbot renew --quiet

# Copy new certificates
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $CERT_DIR/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $CERT_DIR/

# Fix permissions
chown -R $ACTUAL_USER:$ACTUAL_USER $CERT_DIR
chmod 600 $CERT_DIR/*

# Restart app if using PM2
if command -v pm2 &> /dev/null; then
  pm2 restart articles-app
fi

echo "\$(date): SSL certificates renewed" >> /var/log/ssl-renewal.log
EOF

chmod +x /usr/local/bin/renew-ssl.sh

# Add to cron
echo "0 0 1 * * /usr/local/bin/renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1" | crontab -

echo ""
echo "✅ SSL Setup Complete!"
echo ""
echo "Certificates installed at: $CERT_DIR"
echo "Certificate will auto-renew on the 1st of each month"
echo ""
echo "Next steps:"
echo "1. Set ENABLE_HTTPS=true in server/.env"
echo "2. Build your application: npm run build"
echo "3. Start with: sudo pm2 start ecosystem.config.js"
echo ""
echo "Test HTTPS: curl -I https://$DOMAIN"


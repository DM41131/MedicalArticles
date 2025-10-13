# EC2 Deployment Guide with HTTP & HTTPS

This guide explains how to deploy your application to AWS EC2 with both HTTP and HTTPS support without using a load balancer.

## 📋 Prerequisites

- AWS EC2 instance (Ubuntu 20.04 or later recommended)
- Domain name pointed to your EC2 instance
- SSH access to your EC2 instance
- Node.js 18+ and MongoDB installed on EC2

## 🔧 Server Configuration Updates

The application now supports:
- ✅ HTTP on port 80
- ✅ HTTPS on port 443
- ✅ Automatic HTTP to HTTPS redirect
- ✅ Let's Encrypt SSL certificates

## 🚀 Step-by-Step Deployment

### Step 1: Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 2: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Certbot for Let's Encrypt
sudo apt install -y certbot
```

### Step 3: Configure Domain

Make sure your domain (e.g., `example.com`) points to your EC2 instance's public IP:

```bash
# Check your public IP
curl ifconfig.me
```

Add an A record in your DNS settings:
- **Type**: A
- **Name**: @ (or your subdomain)
- **Value**: Your EC2 public IP
- **TTL**: 3600

### Step 4: Clone and Setup Application

```bash
# Clone your repository
git clone <your-repo-url>
cd Test_site_2

# Install dependencies
npm run install-all

# Create environment file
cd server
nano .env
```

**Add the following to `.env`:**
```env
NODE_ENV=production
PORT=80
HTTPS_PORT=443
ENABLE_HTTPS=true
MONGODB_URI=mongodb://localhost:27017/articles
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### Step 5: Obtain SSL Certificate

```bash
# Stop any service using port 80
sudo lsof -ti:80 | xargs sudo kill -9

# Get certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be saved at:
# - Certificate: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# - Private Key: /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Step 6: Setup Certificates for Application

```bash
# Create certs directory
cd ~/Test_site_2/server
mkdir -p certs

# Copy certificates (requires sudo)
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem certs/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem certs/

# Change ownership
sudo chown $USER:$USER certs/*
```

### Step 7: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
sudo ufw status
```

**Also configure AWS Security Group:**
- Go to EC2 → Security Groups
- Add Inbound Rules:
  - Type: HTTP, Port: 80, Source: 0.0.0.0/0
  - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
  - Type: SSH, Port: 22, Source: Your IP

### Step 8: Build and Run Application

```bash
cd ~/Test_site_2

# Initialize database
npm run db:init
npm run db:create-admin

# Build client
npm run build

# Run application (requires sudo for ports 80 and 443)
sudo -E NODE_ENV=production npm start
```

## 🔄 Running as a Service (PM2)

For production, use PM2 to keep your app running:

### Install PM2

```bash
sudo npm install -g pm2
```

### Create PM2 Ecosystem File

Create `ecosystem.config.js` in the root directory:

```javascript
module.exports = {
  apps: [{
    name: 'articles-app',
    cwd: './server',
    script: 'src/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 80,
      HTTPS_PORT: 443,
      ENABLE_HTTPS: 'true'
    }
  }]
};
```

### Start with PM2

```bash
cd ~/Test_site_2

# Build first
npm run build

# Start with PM2 (requires sudo for ports 80 and 443)
sudo pm2 start ecosystem.config.js

# Save PM2 configuration
sudo pm2 save

# Setup PM2 to start on boot
sudo pm2 startup systemd -u $USER --hp /home/$USER
```

### PM2 Commands

```bash
# View logs
sudo pm2 logs articles-app

# Restart app
sudo pm2 restart articles-app

# Stop app
sudo pm2 stop articles-app

# View status
sudo pm2 status

# Monitor
sudo pm2 monit
```

## 🔐 SSL Certificate Auto-Renewal

Let's Encrypt certificates expire after 90 days. Setup auto-renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Create renewal script
sudo nano /etc/cron.d/certbot-renewal
```

Add this content:
```bash
0 0,12 * * * root certbot renew --post-hook "pm2 restart articles-app" >> /var/log/letsencrypt-renew.log 2>&1
```

Or use the automated renewal script:

```bash
# Create renewal script
cat << 'EOF' | sudo tee /usr/local/bin/renew-ssl.sh
#!/bin/bash
# Renew certificates
certbot renew --quiet

# Copy new certificates
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /home/ubuntu/Test_site_2/server/certs/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /home/ubuntu/Test_site_2/server/certs/

# Fix permissions
chown ubuntu:ubuntu /home/ubuntu/Test_site_2/server/certs/*

# Restart app
pm2 restart articles-app
EOF

# Make executable
sudo chmod +x /usr/local/bin/renew-ssl.sh

# Add to cron
echo "0 0 1 * * /usr/local/bin/renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1" | sudo crontab -
```

## 🌐 How It Works

### URL Structure

| URL | Port | Description |
|-----|------|-------------|
| `http://yourdomain.com` | 80 | Redirects to HTTPS |
| `https://yourdomain.com` | 443 | Main application |
| `http://yourdomain.com/api/health` | 80 | Redirects to HTTPS |
| `https://yourdomain.com/api/health` | 443 | API endpoint |

### Traffic Flow

1. User visits `http://yourdomain.com`
2. Express receives request on port 80
3. Middleware detects non-HTTPS request
4. Redirects to `https://yourdomain.com`
5. User is served over HTTPS on port 443

## 🔍 Testing

### Test HTTP (Should redirect)
```bash
curl -I http://yourdomain.com
# Should show: HTTP/1.1 301 Moved Permanently
# Location: https://yourdomain.com/
```

### Test HTTPS
```bash
curl -I https://yourdomain.com
# Should show: HTTP/1.1 200 OK
```

### Test API
```bash
curl https://yourdomain.com/api/health
# Should return: {"success":true,"message":"Server is running"}
```

## 🐛 Troubleshooting

### Issue: Port 80 already in use
```bash
# Find process
sudo lsof -i :80

# Kill process
sudo kill -9 <PID>
```

### Issue: Port 443 already in use
```bash
# Find process
sudo lsof -i :443

# Kill process
sudo kill -9 <PID>
```

### Issue: Permission denied on ports 80/443
Solution: Must run with sudo:
```bash
sudo -E NODE_ENV=production npm start
# or with PM2
sudo pm2 start ecosystem.config.js
```

### Issue: Certificates not found
```bash
# Check certificate location
sudo ls -la /etc/letsencrypt/live/yourdomain.com/

# Verify copy to app
ls -la ~/Test_site_2/server/certs/
```

### Issue: MongoDB connection failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# View logs
sudo journalctl -u mongod -f
```

## 📊 Monitoring

### Check Application Logs
```bash
# PM2 logs
sudo pm2 logs articles-app

# System logs
sudo journalctl -u mongod -f
```

### Check SSL Certificate Status
```bash
sudo certbot certificates
```

### Monitor System Resources
```bash
# CPU and Memory
htop

# Disk usage
df -h

# PM2 monitoring
sudo pm2 monit
```

## 🔒 Security Best Practices

1. **Keep certificates updated**: Setup auto-renewal
2. **Strong JWT secret**: Use a long random string
3. **MongoDB security**: Enable authentication
4. **Firewall**: Only open necessary ports
5. **Regular updates**: Keep system and packages updated
6. **Backups**: Regular database backups
7. **HTTPS only**: Force HTTPS in production

## 🚀 Production Checklist

- [ ] Domain points to EC2 IP
- [ ] SSL certificates obtained and installed
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] AWS Security Group configured
- [ ] MongoDB running and secured
- [ ] Environment variables set correctly
- [ ] Application built (`npm run build`)
- [ ] PM2 configured and running
- [ ] Auto-renewal setup for SSL
- [ ] Monitoring and logging configured
- [ ] Regular backups scheduled

## 📱 Client Environment

The client automatically uses relative paths in production. No additional configuration needed!

**`client/.env.production`** (already configured):
```env
VITE_API_URL=/api
```

## 🔄 Updating Application

```bash
# SSH to server
ssh -i your-key.pem ubuntu@your-ec2-ip

# Navigate to app
cd ~/Test_site_2

# Pull latest changes
git pull

# Install any new dependencies
npm run install-all

# Rebuild client
npm run build

# Restart app
sudo pm2 restart articles-app
```

---

## 🎯 Quick Commands Reference

```bash
# View logs
sudo pm2 logs

# Restart app
sudo pm2 restart articles-app

# View status
sudo pm2 status

# Check SSL expiry
sudo certbot certificates

# MongoDB status
sudo systemctl status mongod

# View firewall rules
sudo ufw status

# Test HTTPS
curl -I https://yourdomain.com
```

Need help? Check the logs: `sudo pm2 logs articles-app`


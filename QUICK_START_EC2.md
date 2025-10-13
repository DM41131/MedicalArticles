# Quick Start - EC2 Deployment with HTTPS

Fast deployment guide for AWS EC2 with HTTP and HTTPS support.

## ⚡ Quick Commands

### 1. Setup Server (First Time Only)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2
```

### 2. Clone and Setup Application

```bash
# Clone repository
git clone <your-repo-url>
cd Test_site_2

# Install dependencies
npm run install-all

# Create environment file
cd server
nano .env
```

**Add to `.env`:**
```env
NODE_ENV=production
PORT=80
HTTPS_PORT=443
ENABLE_HTTPS=true
MONGODB_URI=mongodb://localhost:27017/articles
JWT_SECRET=your-super-secret-change-this
```

### 3. Setup SSL Certificate (One Command!)

```bash
cd ~/Test_site_2

# Make script executable
chmod +x setup-ssl.sh

# Run SSL setup (replace with your domain)
sudo ./setup-ssl.sh yourdomain.com
```

### 4. Configure Firewall

```bash
# UFW Firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

**AWS Security Group:** Add inbound rules for ports 80, 443, 22

### 5. Initialize Database

```bash
cd ~/Test_site_2
npm run db:init
npm run db:create-admin
```

### 6. Deploy!

```bash
# Build application
npm run build

# Start with PM2
sudo pm2 start ecosystem.config.js

# Save PM2 config
sudo pm2 save

# Setup auto-start on reboot
sudo pm2 startup systemd
```

## ✅ Verify Deployment

```bash
# Check HTTP (should redirect to HTTPS)
curl -I http://yourdomain.com

# Check HTTPS
curl -I https://yourdomain.com

# Test API
curl https://yourdomain.com/api/health
```

## 🔄 Update Application

```bash
cd ~/Test_site_2
git pull
npm run install-all
npm run build
sudo pm2 restart articles-app
```

## 📊 Monitor

```bash
# View logs
sudo pm2 logs

# Monitor performance
sudo pm2 monit

# Check status
sudo pm2 status
```

## 🚨 Troubleshooting

### Port already in use
```bash
sudo lsof -i :80    # Check port 80
sudo lsof -i :443   # Check port 443
sudo pm2 list       # List PM2 processes
sudo pm2 delete all # Stop all PM2 processes
```

### Certificate issues
```bash
sudo certbot certificates          # Check certificate status
ls -la ~/Test_site_2/server/certs/ # Verify certificates copied
```

### Application not starting
```bash
sudo pm2 logs articles-app --lines 50  # View recent logs
sudo systemctl status mongod          # Check MongoDB
```

## 🔐 Security Checklist

- [ ] Domain points to EC2 IP
- [ ] SSL certificate installed and working
- [ ] Firewall configured (UFW + AWS Security Group)
- [ ] Strong JWT_SECRET set
- [ ] MongoDB authentication enabled (optional but recommended)
- [ ] Auto-renewal setup for SSL (automatic with script)
- [ ] Regular backups scheduled

## 📱 URLs After Deployment

| URL | Result |
|-----|--------|
| `http://yourdomain.com` | → Redirects to HTTPS |
| `https://yourdomain.com` | ✅ Main application |
| `https://yourdomain.com/admin` | ✅ Admin dashboard |
| `https://yourdomain.com/api/health` | ✅ API health check |

## 🎯 Default Credentials

After running `npm run db:create-admin`, default admin credentials:
- **Username:** See console output
- **Password:** See console output

⚠️ **Important:** Change the admin password immediately after first login!

---

For detailed instructions, see [EC2_DEPLOYMENT_HTTPS.md](./EC2_DEPLOYMENT_HTTPS.md)


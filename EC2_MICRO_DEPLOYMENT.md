# 🚀 EC2 Micro Instance Deployment Guide (1GB RAM)

Optimized deployment guide for AWS EC2 t2.micro instances with memory constraints.

## 📋 Prerequisites

- AWS EC2 t2.micro instance (1GB RAM)
- Ubuntu 20.04 LTS or 22.04 LTS
- Security group configured (ports 22, 80, 443)
- Domain name (optional)

## 🎯 Memory Optimizations

### **Build Optimizations:**
- ✅ **Vite memory limits**: Max 512MB during build
- ✅ **Node.js memory limits**: Max 512MB old space, 64MB semi space
- ✅ **Swap file**: 2GB additional virtual memory
- ✅ **Chunk splitting**: Manual chunks for better caching
- ✅ **Terser minification**: Removes console logs and debugger
- ✅ **No sourcemaps**: Reduces build size and memory usage

### **Runtime Optimizations:**
- ✅ **PM2 fork mode**: Single instance instead of cluster
- ✅ **Memory restart**: Auto-restart at 800MB usage
- ✅ **Resource limits**: Optimized Node.js arguments
- ✅ **Production dependencies only**: Smaller node_modules

## 🚀 Quick Deployment

### **1. Connect to EC2 Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### **2. Run Deployment Script**
```bash
# Clone your repository
git clone https://github.com/DM41131/MedicalArticles.git
cd MedicalArticles

# Make deployment script executable and run
chmod +x ec2-deploy.sh
./ec2-deploy.sh
```

### **3. Manual Setup (Alternative)**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 🔧 Application Setup

### **1. Install Dependencies**
```bash
# Install with memory optimization
npm ci --only=production --no-audit --no-fund

# Install client dependencies
cd client
npm ci --only=production --no-audit --no-fund
cd ..
```

### **2. Build Application**
```bash
# Use memory-efficient build script
npm run build:low-memory
```

### **3. Configure Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```bash
MONGODB_URI=mongodb://localhost:27017/articles_db
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
UPLOAD_DIR=./src/uploads
```

### **4. Initialize Database**
```bash
npm run db:init
```

### **5. Start Application**
```bash
# Start with PM2
npm run start:pm2

# Check status
npm run status
```

## 🌐 Web Server Setup

### **Install and Configure Nginx**
```bash
sudo apt install -y nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/articles-app
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/articles-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 SSL Setup (Optional)

### **Install Certbot**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### **Get SSL Certificate**
```bash
sudo certbot --nginx -d your-domain.com
```

## 📊 Monitoring

### **Check Memory Usage**
```bash
# System memory
free -h

# PM2 memory usage
pm2 monit

# Application logs
pm2 logs
```

### **PM2 Commands**
```bash
npm run status      # Check app status
npm run monitor     # Real-time monitoring
npm run logs        # View logs
npm run restart:pm2 # Restart application
npm run stop:pm2    # Stop application
```

## 🛠️ Troubleshooting

### **Memory Issues**
```bash
# Check memory usage
free -h
top

# Check swap usage
swapon --show

# Restart if memory is high
pm2 restart articles-app
```

### **Build Failures**
```bash
# Clean and rebuild
rm -rf client/dist
rm -rf node_modules/.vite
npm run build:low-memory
```

### **Database Issues**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check database connection
npm run db:init
```

## 📈 Performance Tips

### **Memory Optimization**
- ✅ Use `npm ci` instead of `npm install`
- ✅ Install only production dependencies
- ✅ Enable swap file for additional memory
- ✅ Use PM2 fork mode instead of cluster
- ✅ Set memory restart limits

### **Build Optimization**
- ✅ Use memory-efficient build script
- ✅ Disable sourcemaps in production
- ✅ Use Terser minification
- ✅ Split chunks manually
- ✅ Remove console logs

## 💰 Cost Optimization

**EC2 t2.micro Benefits:**
- ✅ **Free tier eligible** (750 hours/month for 12 months)
- ✅ **Low cost**: ~$8.50/month after free tier
- ✅ **Sufficient for small to medium apps**
- ✅ **Auto-scaling available**

## 🎉 Success!

Your memory-optimized articles management system is now running on EC2 micro!

**Features:**
- ✅ **Memory-efficient build** (under 1GB RAM)
- ✅ **Automatic restarts** on memory issues
- ✅ **Production-ready** with PM2
- ✅ **SSL support** with Let's Encrypt
- ✅ **Database management** scripts
- ✅ **Monitoring** and logging

**Access your app:**
- 🌐 **HTTP**: `http://your-ec2-ip`
- 🔒 **HTTPS**: `https://your-domain.com` (if SSL configured)

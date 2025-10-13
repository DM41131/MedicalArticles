#!/bin/bash

# EC2 Micro Instance Deployment Script (1GB RAM)
# Optimized for memory constraints

echo "🚀 Deploying to EC2 micro instance..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 (LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install MongoDB
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
echo "🔄 Starting MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod

# Create swap file for additional memory
echo "💾 Creating swap file..."
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Clone repository (if not already present)
if [ ! -d "articles-app" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/DM41131/MedicalArticles.git articles-app
fi

cd articles-app

# Set up environment
echo "⚙️ Setting up environment..."
cp .env.example .env
# Edit .env file with your configuration

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production --no-audit --no-fund

# Install client dependencies
cd client
npm ci --only=production --no-audit --no-fund
cd ..

# Build with memory optimization
echo "🔨 Building application..."
chmod +x build-low-memory.sh
./build-low-memory.sh

# Initialize database
echo "🗄️ Initializing database..."
cd server
npm run db:init
cd ..

# Set up PM2 ecosystem
echo "⚙️ Setting up PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Install and configure Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/articles-app > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/articles-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "🎉 Deployment completed!"
echo "📊 Memory usage:"
free -h
echo "💾 Disk usage:"
df -h
echo "🔄 PM2 status:"
pm2 status

echo "🌐 Your app should be available at: http://your-ec2-ip"
echo "📝 Don't forget to:"
echo "   1. Update .env file with your configuration"
echo "   2. Set up SSL certificate (Let's Encrypt)"
echo "   3. Configure your domain name"

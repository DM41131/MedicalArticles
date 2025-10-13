#!/bin/bash

# Memory-efficient build script for EC2 micro instances (1GB RAM)
# This script builds the app with minimal memory usage

echo "🚀 Starting memory-efficient build for EC2 micro instance..."

# Set Node.js memory limits
export NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=64"

# Create swap file if it doesn't exist (helps with memory constraints)
if [ ! -f /swapfile ]; then
    echo "📝 Creating swap file for additional memory..."
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf client/dist
rm -rf node_modules/.vite

# Install dependencies with memory optimization
echo "📦 Installing dependencies with memory optimization..."
npm ci --only=production --no-audit --no-fund

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm ci --only=production --no-audit --no-fund
cd ..

# Build client with memory optimization
echo "🔨 Building client (this may take a while on low memory)..."
cd client
NODE_OPTIONS="--max-old-space-size=512" npm run build
cd ..

# Check build success
if [ -d "client/dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build size:"
    du -sh client/dist
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Memory-efficient build completed!"
echo "💡 You can now start the server with: npm start"

#!/bin/bash

# Environment Setup Script
# This script creates all necessary .env files for the application

set -e

echo "🔧 Environment Setup Script"
echo "==========================="
echo ""

# Detect if running on Windows (Git Bash or WSL)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  IS_WINDOWS=true
else
  IS_WINDOWS=false
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Function to generate random JWT secret
generate_jwt_secret() {
  if command -v openssl &> /dev/null; then
    openssl rand -hex 64
  elif command -v node &> /dev/null; then
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  else
    echo "fallback-secret-$(date +%s)-change-this-immediately"
  fi
}

# Ask user for environment type
echo "Select environment setup:"
echo "1) Development (default ports, HTTP only)"
echo "2) Production (ports 80/443, HTTPS ready)"
echo "3) Both"
echo ""
read -p "Enter choice [1-3] (default: 1): " env_choice
env_choice=${env_choice:-1}

# Generate JWT secret
echo ""
echo "Generating secure JWT secret..."
JWT_SECRET=$(generate_jwt_secret)
print_success "JWT secret generated"

# Create server/.env for development
if [[ "$env_choice" == "1" || "$env_choice" == "3" ]]; then
  echo ""
  echo "Creating server/.env for development..."
  
  cat > server/.env << EOF
# Environment
NODE_ENV=development

# Server Ports
PORT=5000
HTTPS_PORT=443

# HTTPS Configuration
ENABLE_HTTPS=false

# Database
MONGODB_URI=mongodb://localhost:27017/articles

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
EOF

  print_success "server/.env created (development mode)"
fi

# Create server/.env for production
if [[ "$env_choice" == "2" ]]; then
  echo ""
  echo "Creating server/.env for production..."
  
  read -p "Enable HTTPS? (y/n, default: y): " enable_https
  enable_https=${enable_https:-y}
  
  if [[ "$enable_https" == "y" ]]; then
    ENABLE_HTTPS_VALUE="true"
    PORT_VALUE="80"
  else
    ENABLE_HTTPS_VALUE="false"
    PORT_VALUE="5000"
  fi
  
  cat > server/.env << EOF
# Environment
NODE_ENV=production

# Server Ports
PORT=${PORT_VALUE}
HTTPS_PORT=443

# HTTPS Configuration
ENABLE_HTTPS=${ENABLE_HTTPS_VALUE}

# Database
MONGODB_URI=mongodb://localhost:27017/articles

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
EOF

  print_success "server/.env created (production mode)"
  
  if [[ "$ENABLE_HTTPS_VALUE" == "true" ]]; then
    print_warning "HTTPS is enabled. Don't forget to setup SSL certificates!"
    echo "Run: sudo ./setup-ssl.sh yourdomain.com"
  fi
fi

# Create client/.env.development
echo ""
echo "Creating client/.env.development..."

cat > client/.env.development << 'EOF'
# API URL for development (points to separate backend server)
VITE_API_URL=http://localhost:5000/api
EOF

print_success "client/.env.development created"

# Create client/.env.production
echo ""
echo "Creating client/.env.production..."

cat > client/.env.production << 'EOF'
# API URL for production (uses relative path - same server)
VITE_API_URL=/api
EOF

print_success "client/.env.production created"

# Summary
echo ""
echo "=========================================="
echo "✨ Environment setup complete!"
echo "=========================================="
echo ""
echo "Created files:"
echo "  • server/.env"
echo "  • client/.env.development"
echo "  • client/.env.production"
echo ""

if [[ "$env_choice" == "1" || "$env_choice" == "3" ]]; then
  echo "Development configuration:"
  echo "  • Server: http://localhost:5000"
  echo "  • Client: http://localhost:3000"
  echo "  • HTTPS: Disabled"
  echo ""
  echo "Start development: npm run dev"
fi

if [[ "$env_choice" == "2" ]]; then
  echo "Production configuration:"
  echo "  • Server: http://localhost:${PORT_VALUE}"
  if [[ "$ENABLE_HTTPS_VALUE" == "true" ]]; then
    echo "  • HTTPS: Enabled (port 443)"
  else
    echo "  • HTTPS: Disabled"
  fi
  echo ""
  echo "Build and start: npm run build:prod"
fi

echo ""
echo "📝 Important:"
echo "  1. Review server/.env and update values as needed"
echo "  2. Never commit .env files to version control"
echo "  3. Keep JWT_SECRET secure and private"
if [[ "$env_choice" == "2" && "$ENABLE_HTTPS_VALUE" == "true" ]]; then
  echo "  4. Setup SSL certificates before starting production server"
fi
echo ""
echo "📚 For more information, see ENV_SETUP.md"


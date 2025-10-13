# Environment Setup Script for Windows PowerShell
# This script creates all necessary .env files for the application

Write-Host "🔧 Environment Setup Script" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

# Function to generate random JWT secret
function Generate-JwtSecret {
    $bytes = New-Object byte[] 64
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $secret = [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
    return $secret
}

# Function to print colored output
function Write-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Ask user for environment type
Write-Host "Select environment setup:"
Write-Host "1) Development (default ports, HTTP only)"
Write-Host "2) Production (ports 80/443, HTTPS ready)"
Write-Host "3) Both"
Write-Host ""
$envChoice = Read-Host "Enter choice [1-3] (default: 1)"
if ([string]::IsNullOrWhiteSpace($envChoice)) {
    $envChoice = "1"
}

# Generate JWT secret
Write-Host ""
Write-Host "Generating secure JWT secret..."
$jwtSecret = Generate-JwtSecret
Write-Success "JWT secret generated"

# Create server/.env for development
if ($envChoice -eq "1" -or $envChoice -eq "3") {
    Write-Host ""
    Write-Host "Creating server/.env for development..."
    
    $serverEnvContent = @"
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
JWT_SECRET=$jwtSecret
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
"@

    $serverEnvContent | Out-File -FilePath "server\.env" -Encoding UTF8 -NoNewline
    Write-Success "server/.env created (development mode)"
}

# Create server/.env for production
if ($envChoice -eq "2") {
    Write-Host ""
    Write-Host "Creating server/.env for production..."
    
    $enableHttps = Read-Host "Enable HTTPS? (y/n, default: y)"
    if ([string]::IsNullOrWhiteSpace($enableHttps)) {
        $enableHttps = "y"
    }
    
    if ($enableHttps -eq "y") {
        $enableHttpsValue = "true"
        $portValue = "80"
    } else {
        $enableHttpsValue = "false"
        $portValue = "5000"
    }
    
    $serverEnvContent = @"
# Environment
NODE_ENV=production

# Server Ports
PORT=$portValue
HTTPS_PORT=443

# HTTPS Configuration
ENABLE_HTTPS=$enableHttpsValue

# Database
MONGODB_URI=mongodb://localhost:27017/articles

# JWT Configuration
JWT_SECRET=$jwtSecret
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
"@

    $serverEnvContent | Out-File -FilePath "server\.env" -Encoding UTF8 -NoNewline
    Write-Success "server/.env created (production mode)"
    
    if ($enableHttpsValue -eq "true") {
        Write-Warning "HTTPS is enabled. Don't forget to setup SSL certificates!"
        Write-Host "For EC2: Run setup-ssl.sh on the server"
    }
}

# Create client/.env.development
Write-Host ""
Write-Host "Creating client/.env.development..."

$clientDevContent = @"
# API URL for development (points to separate backend server)
VITE_API_URL=http://localhost:5000/api
"@

$clientDevContent | Out-File -FilePath "client\.env.development" -Encoding UTF8 -NoNewline
Write-Success "client/.env.development created"

# Create client/.env.production
Write-Host ""
Write-Host "Creating client/.env.production..."

$clientProdContent = @"
# API URL for production (uses relative path - same server)
VITE_API_URL=/api
"@

$clientProdContent | Out-File -FilePath "client\.env.production" -Encoding UTF8 -NoNewline
Write-Success "client/.env.production created"

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✨ Environment setup complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Created files:"
Write-Host "  • server/.env"
Write-Host "  • client/.env.development"
Write-Host "  • client/.env.production"
Write-Host ""

if ($envChoice -eq "1" -or $envChoice -eq "3") {
    Write-Host "Development configuration:" -ForegroundColor Cyan
    Write-Host "  • Server: http://localhost:5000"
    Write-Host "  • Client: http://localhost:3000"
    Write-Host "  • HTTPS: Disabled"
    Write-Host ""
    Write-Host "Start development: " -NoNewline
    Write-Host "npm run dev" -ForegroundColor Yellow
}

if ($envChoice -eq "2") {
    Write-Host "Production configuration:" -ForegroundColor Cyan
    Write-Host "  • Server: http://localhost:$portValue"
    if ($enableHttpsValue -eq "true") {
        Write-Host "  • HTTPS: Enabled (port 443)"
    } else {
        Write-Host "  • HTTPS: Disabled"
    }
    Write-Host ""
    Write-Host "Build and start: " -NoNewline
    Write-Host "npm run build:prod" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Important:" -ForegroundColor Yellow
Write-Host "  1. Review server/.env and update values as needed"
Write-Host "  2. Never commit .env files to version control"
Write-Host "  3. Keep JWT_SECRET secure and private"
if ($envChoice -eq "2" -and $enableHttpsValue -eq "true") {
    Write-Host "  4. Setup SSL certificates before starting production server"
}
Write-Host ""
Write-Host "📚 For more information, see ENV_SETUP.md" -ForegroundColor Cyan
Write-Host ""


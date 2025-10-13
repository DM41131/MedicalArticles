# Environment Configuration Guide

This guide explains how to set up environment variables for development and production.

## 📁 Required Environment Files

### 1. Server Environment (`server/.env`)

Create `server/.env` file:

```env
# Environment
NODE_ENV=development

# Server Ports
PORT=5000
HTTPS_PORT=443

# HTTPS Configuration
# Set to 'true' in production with SSL certificates
ENABLE_HTTPS=false

# Database
MONGODB_URI=mongodb://localhost:27017/articles

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload Configuration (optional)
MAX_FILE_SIZE=5242880

# CORS (optional, defaults to allow all in development)
# CORS_ORIGIN=http://localhost:3000
```

### 2. Client Development Environment (`client/.env.development`)

Create `client/.env.development` file:

```env
# API URL for development (points to separate backend server)
VITE_API_URL=http://localhost:5000/api
```

### 3. Client Production Environment (`client/.env.production`)

Create `client/.env.production` file:

```env
# API URL for production (uses relative path - same server)
VITE_API_URL=/api
```

## 🚀 Quick Setup

### For Development

```bash
# 1. Create server environment file
cat > server/.env << 'EOF'
NODE_ENV=development
PORT=5000
HTTPS_PORT=443
ENABLE_HTTPS=false
MONGODB_URI=mongodb://localhost:27017/articles
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
EOF

# 2. Create client development environment file
cat > client/.env.development << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

# 3. Create client production environment file
cat > client/.env.production << 'EOF'
VITE_API_URL=/api
EOF
```

### For Production (EC2)

```bash
# 1. Create server environment file with production settings
cat > server/.env << 'EOF'
NODE_ENV=production
PORT=80
HTTPS_PORT=443
ENABLE_HTTPS=true
MONGODB_URI=mongodb://localhost:27017/articles
JWT_SECRET=CHANGE-THIS-TO-A-LONG-RANDOM-STRING
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
EOF

# 2. Client production environment (same as development)
cat > client/.env.production << 'EOF'
VITE_API_URL=/api
EOF

# 3. Generate a strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy the output and update JWT_SECRET in server/.env
```

## 🔐 Environment Variables Explained

### Server Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | ✅ |
| `PORT` | HTTP server port | `5000` (dev), `80` (prod) | ✅ |
| `HTTPS_PORT` | HTTPS server port | `443` | ❌ |
| `ENABLE_HTTPS` | Enable HTTPS server | `false` | ❌ |
| `MONGODB_URI` | MongoDB connection string | - | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | - | ✅ |
| `JWT_EXPIRE` | JWT token expiration | `7d` | ❌ |
| `MAX_FILE_SIZE` | Max upload file size (bytes) | `5242880` (5MB) | ❌ |

### Client Variables

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | `/api` |

## 🔄 Environment Modes

### Development Mode

**Characteristics:**
- Frontend and backend run on separate ports
- Frontend: `http://localhost:3000` (Vite dev server)
- Backend: `http://localhost:5000` (Express)
- Hot module replacement (HMR) enabled
- Detailed error messages
- No HTTPS required

**Start Command:**
```bash
npm run dev
```

### Production Mode

**Characteristics:**
- Frontend and backend on same port
- Everything: `http://localhost:5000` or `https://yourdomain.com`
- Frontend served as static files
- Backend API under `/api/*`
- Optimized builds
- HTTPS recommended

**Start Command:**
```bash
npm run build:prod
```

## 🔒 Security Best Practices

### JWT Secret

**Bad (Development):**
```env
JWT_SECRET=secret123
```

**Good (Production):**
```env
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c03c91df5f79b3f7d9f8c0e4e3e3e3e3e
```

Generate secure JWT secret:
```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 64

# Method 3: Online generator (use only for development!)
# Visit: https://www.grc.com/passwords.htm
```

### MongoDB URI

**Development:**
```env
MONGODB_URI=mongodb://localhost:27017/articles
```

**Production with Authentication:**
```env
MONGODB_URI=mongodb://username:password@localhost:27017/articles?authSource=admin
```

**Production with MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/articles?retryWrites=true&w=majority
```

## 📝 Environment File Templates

### Windows (PowerShell)

**Server:**
```powershell
@"
NODE_ENV=development
PORT=5000
HTTPS_PORT=443
ENABLE_HTTPS=false
MONGODB_URI=mongodb://localhost:27017/articles
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRE=7d
"@ | Out-File -FilePath server\.env -Encoding UTF8
```

**Client Development:**
```powershell
@"
VITE_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath client\.env.development -Encoding UTF8
```

**Client Production:**
```powershell
@"
VITE_API_URL=/api
"@ | Out-File -FilePath client\.env.production -Encoding UTF8
```

### Linux/Mac (Bash)

**Server:**
```bash
cat > server/.env << 'EOF'
NODE_ENV=development
PORT=5000
HTTPS_PORT=443
ENABLE_HTTPS=false
MONGODB_URI=mongodb://localhost:27017/articles
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRE=7d
EOF
```

**Client Development:**
```bash
cat > client/.env.development << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF
```

**Client Production:**
```bash
cat > client/.env.production << 'EOF'
VITE_API_URL=/api
EOF
```

## ✅ Verification

After creating environment files, verify they're set up correctly:

```bash
# Check server environment
cat server/.env

# Check client development environment
cat client/.env.development

# Check client production environment
cat client/.env.production

# Test development mode
npm run dev

# Test production mode
npm run build:prod
```

## 🔍 Troubleshooting

### Issue: Environment variables not loading

**Solution:**
1. Make sure `.env` files are in the correct directories
2. Restart the development servers
3. Check file encoding (should be UTF-8)
4. Verify no extra spaces around `=` signs

### Issue: API calls failing in production

**Solution:**
1. Check `VITE_API_URL` in `client/.env.production` is `/api`
2. Verify build completed: `ls client/dist`
3. Check server is in production mode: Look for "production mode" in logs

### Issue: MongoDB connection failed

**Solution:**
1. Verify MongoDB is running: `sudo systemctl status mongod`
2. Check `MONGODB_URI` format
3. Test connection: `mongo mongodb://localhost:27017/articles`

### Issue: JWT authentication not working

**Solution:**
1. Verify `JWT_SECRET` is set and not empty
2. Check it's the same across restarts
3. Generate a new secure secret if needed

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [JWT Best Practices](https://github.com/dwyl/learn-json-web-tokens)

## 🎯 Quick Reference

| Scenario | Command | Environment Files Needed |
|----------|---------|-------------------------|
| Local Development | `npm run dev` | `server/.env`, `client/.env.development` |
| Production Build | `npm run build:prod` | `server/.env`, `client/.env.production` |
| EC2 Deployment | `sudo pm2 start ecosystem.config.js` | `server/.env` (production settings) |

---

**Important:** Never commit `.env` files to version control! They're already in `.gitignore`.


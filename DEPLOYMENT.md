# Deployment Guide - Serving Frontend and Backend on Same Port

This guide explains how to run both the React frontend and Express backend on the same port.

## 🏗️ Architecture

### Development Mode (Separate Ports)
- **Frontend**: Runs on `http://localhost:3000` (Vite dev server)
- **Backend**: Runs on `http://localhost:5000` (Express server)
- API calls: `http://localhost:5000/api/*`

### Production Mode (Same Port)
- **Both**: Run on `http://localhost:5000` (Express server)
- Frontend: Served as static files from `/`
- Backend API: Served from `/api/*`

## 📋 Setup Instructions

### Step 1: Create Environment Files

Create these files in the `client` directory:

**`client/.env.development`**
```env
VITE_API_URL=http://localhost:5000/api
```

**`client/.env.production`**
```env
VITE_API_URL=/api
```

### Step 2: Update Server Environment

In `server/.env`, ensure you have:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/articles
JWT_SECRET=your-secret-key-here
```

## 🚀 Running in Production Mode

### Option 1: Quick Start
```bash
# Build and run
npm run build:prod
```

### Option 2: Step by Step
```bash
# 1. Build the React app
npm run build

# 2. Start the server in production mode
npm run start:prod
```

### Option 3: Manual (Linux/Mac)
```bash
# Build client
cd client && npm run build && cd ..

# Start server with NODE_ENV
cd server && NODE_ENV=production npm start
```

### Option 4: Manual (Windows)
```bash
# Build client
cd client
npm run build
cd ..

# Start server with NODE_ENV
cd server
set NODE_ENV=production
npm start
```

## 🔧 How It Works

### Server Configuration (`server/src/index.js`)
```javascript
// API Routes (always active)
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
// ... other routes

// In production: Serve React static files
if (config.nodeEnv === 'production') {
  app.use(express.static(clientBuildPath));
  
  // Handle React routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}
```

### Client Configuration (`client/src/api/http.js`)
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
```
- Development: Uses `http://localhost:5000/api`
- Production: Uses relative path `/api`

## 🌐 URL Structure in Production

| URL | Served By | Description |
|-----|-----------|-------------|
| `http://localhost:5000/` | React | Home page |
| `http://localhost:5000/articles` | React | Articles page |
| `http://localhost:5000/admin` | React | Admin dashboard |
| `http://localhost:5000/api/health` | Express | Health check API |
| `http://localhost:5000/api/articles` | Express | Articles API |
| `http://localhost:5000/api/auth/login` | Express | Login API |
| `http://localhost:5000/uploads/*` | Express | Static files |

## ✅ Testing

After starting in production mode:

1. **Check Health Endpoint**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Open Browser**
   - Navigate to: `http://localhost:5000`
   - You should see the React app
   - All API calls should work seamlessly

3. **Verify API Calls**
   - Open DevTools → Network tab
   - API calls should go to `/api/*` (not `http://localhost:5000/api/*`)

## 🚨 Troubleshooting

### Issue: 404 on React Routes After Refresh
**Cause**: Server not configured to handle React routing
**Fix**: Ensure the catch-all route is present (already configured)

### Issue: API Calls Fail
**Cause**: Wrong API URL in production
**Fix**: Verify `.env.production` has `VITE_API_URL=/api`

### Issue: Static Files Not Loading
**Cause**: Build folder path incorrect
**Fix**: Check path in `server/src/index.js` matches your structure

### Issue: CORS Errors
**Cause**: CORS not needed in production (same origin)
**Fix**: CORS is still enabled but shouldn't cause issues

## 📦 Deployment to Production Server

When deploying to a hosting service:

1. Build the client: `npm run build`
2. Copy the entire project (including `client/dist`)
3. Set environment variables on the server
4. Run: `npm run start:prod` or `node server/src/index.js`

## 🔐 Security Notes

- Always use HTTPS in production
- Set strong `JWT_SECRET` in environment variables
- Use environment-specific MongoDB URIs
- Enable rate limiting for production
- Add helmet.js for security headers

## 📚 Additional Scripts

```bash
# Development (separate ports)
npm run dev

# Build only
npm run build

# Production (same port)
npm run build:prod

# Start server only
npm start
```

## 🎯 Benefits of This Setup

✅ Simpler deployment (one server to manage)
✅ No CORS issues in production
✅ Single port for firewall configuration
✅ Easier SSL certificate setup
✅ Better for containerization (Docker)
✅ Reduced infrastructure costs

---

For more information, see the main [README.md](./README.md)


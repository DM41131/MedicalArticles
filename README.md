# Articles Management System

A full-stack web application for managing and displaying articles with markdown support, categories, comments, and admin capabilities.

## Features

- **User Authentication**: Registration and login system
- **Markdown Articles**: Create and edit articles using markdown with live preview
- **Media Support**: Embed images and videos in articles
- **Categories**: Organize articles by categories
- **Comments**: Users can comment on articles
- **View Counter**: Track article views
- **Admin Panel**: Manage articles, categories, and navigation
- **Dynamic Navigation**: Configurable menu structure stored in database
- **Cover Images**: Upload cover images for articles
- **Source Attribution**: Add sources to articles

## Tech Stack

### Frontend
- React 18 with Vite
- Material-UI (MUI)
- React Router
- React-Markdown
- Axios

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Multer (file uploads)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Configure environment variables:

**Option A: Automated Setup (Recommended)**
```bash
# Linux/Mac
chmod +x setup-env.sh
./setup-env.sh

# Windows (PowerShell)
.\setup-env.ps1
```

**Option B: Manual Setup**
```bash
# Create server/.env
cat > server/.env << 'EOF'
NODE_ENV=development
PORT=5000
HTTPS_PORT=443
ENABLE_HTTPS=false
MONGODB_URI=mongodb://localhost:27017/articles
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
EOF

# Create client/.env.development
cat > client/.env.development << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

# Create client/.env.production
cat > client/.env.production << 'EOF'
VITE_API_URL=/api
EOF
```

> 📘 See [ENV_SETUP.md](./ENV_SETUP.md) for detailed configuration options

4. Initialize database (optional but recommended):

```bash
# Create initial categories and navigation
npm run db:init

# Create admin user
npm run db:create-admin
```

5. Start the development servers:

```bash
# From root directory - runs both client and server
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Client
cd client
npm run dev

# Terminal 2 - Server
cd server
npm run dev
```

## Environment Variables

### Server (`server/.env`)
- `NODE_ENV`: Environment mode (`development` or `production`)
- `PORT`: HTTP server port (default: 5000 for dev, 80 for prod)
- `HTTPS_PORT`: HTTPS server port (default: 443)
- `ENABLE_HTTPS`: Enable HTTPS server (`true` or `false`)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (use a strong random string)
- `JWT_EXPIRE`: JWT token expiration (default: 7d)
- `MAX_FILE_SIZE`: Maximum upload file size in bytes (default: 5242880 = 5MB)

### Client (`client/.env.development` & `client/.env.production`)
- `VITE_API_URL`: Backend API URL
  - Development: `http://localhost:5000/api`
  - Production: `/api` (relative path)

> 📚 **Detailed Configuration:** See [ENV_SETUP.md](./ENV_SETUP.md) for complete environment setup guide

## Available Scripts

### Development
- `npm run dev` - Run both client and server in development mode
- `npm run client` - Run only the client (Vite dev server)
- `npm run server` - Run only the server (Node.js with nodemon)

### Production
- `npm run build` - Build the client for production
- `npm run build:prod` - Build and start in production mode (same port)
- `npm run start` - Start the production server
- `npm run start:prod` - Start with NODE_ENV=production

### Database
- `npm run db:init` - Initialize database with categories and navigation
- `npm run db:seed` - Seed database with sample data
- `npm run db:create-admin` - Create admin user
- `npm run db:reset` - Reset database (⚠️ deletes all data)
- `npm run db:migrate-sources` - Migrate old source field to new sources array

### Setup
- `./setup-env.sh` (Linux/Mac) - Setup environment files
- `.\setup-env.ps1` (Windows) - Setup environment files
- `sudo ./setup-ssl.sh yourdomain.com` (EC2) - Setup SSL certificates

## Deployment

### Production Deployment (Same Port)
The application can serve both frontend and backend from the same port:

```bash
# Build frontend
npm run build

# Start production server (serves both frontend and API)
npm run build:prod
```

Both will be available on the same port (default: 5000, or 80 for production):
- Frontend: `http://localhost:5000/`
- API: `http://localhost:5000/api/*`

### EC2 Deployment with HTTPS
For production deployment on AWS EC2 with SSL:

1. Follow the [Quick Start Guide](./QUICK_START_EC2.md)
2. Or see the [Detailed EC2 Guide](./EC2_DEPLOYMENT_HTTPS.md)

```bash
# Quick deployment on EC2
sudo ./setup-ssl.sh yourdomain.com
npm run build
sudo pm2 start ecosystem.config.js
```

> 📖 **Deployment Guides:**
> - [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment basics
> - [EC2_DEPLOYMENT_HTTPS.md](./EC2_DEPLOYMENT_HTTPS.md) - Complete EC2 guide with HTTPS
> - [QUICK_START_EC2.md](./QUICK_START_EC2.md) - Quick reference for EC2

## Project Structure

See the folder structure for detailed organization of components, pages, and API routes.

## Documentation

- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide (same port setup)
- [EC2_DEPLOYMENT_HTTPS.md](./EC2_DEPLOYMENT_HTTPS.md) - EC2 deployment with HTTPS
- [QUICK_START_EC2.md](./QUICK_START_EC2.md) - Quick EC2 deployment reference
- [DATABASE_SCRIPTS.md](./DATABASE_SCRIPTS.md) - Database scripts documentation

## License

MIT


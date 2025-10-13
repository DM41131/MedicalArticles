# Articles Management System - Setup Guide

## Overview
This is a full-stack articles management system with React frontend and Node.js backend, featuring markdown support, categories, comments, and admin capabilities.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies (for running both servers)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 2. Set Up Environment Variables

#### Server Environment (.env in server folder)
Create `server/.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/articles_db
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
UPLOAD_DIR=./src/uploads
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a secure random string in production!

#### Client Environment (.env in client folder)
Create `client/.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env` with your Atlas connection string

#### Option C: Docker (Quick Start)
```bash
docker-compose up -d
```
This will start MongoDB on `mongodb://localhost:27017`

### 4. Start the Application

#### Option A: Run Both Servers Together
```bash
npm run dev
```
This starts both the client (port 3000) and server (port 5000) concurrently.

#### Option B: Run Servers Separately
```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## Initial Setup

### Create Admin User
Since there's no admin user by default, you'll need to create one manually:

1. Register a new user through the UI (http://localhost:3000/login)
2. Connect to MongoDB:
   ```bash
   mongosh
   use articles_db
   ```
3. Update the user role to admin:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```
4. Logout and login again

Alternatively, you can use a MongoDB GUI tool like MongoDB Compass or Studio 3T.

### Create Initial Categories
1. Login as admin
2. Go to http://localhost:3000/admin
3. Click "Manage Categories"
4. Add some categories (e.g., Technology, Science, Lifestyle)

### Configure Navigation
1. Go to http://localhost:3000/admin/navigation
2. The default navigation should already be there
3. Customize as needed

## Features Overview

### Public Features
- ✅ Browse articles with pagination and filtering
- ✅ View articles with markdown rendering
- ✅ Comment on articles (requires login)
- ✅ Browse by categories
- ✅ View counter for articles
- ✅ User registration and login

### Admin Features
- ✅ Create/Edit/Delete articles
- ✅ Markdown editor with live preview
- ✅ Upload cover images for articles
- ✅ Manage categories (CRUD operations)
- ✅ Configure navigation menu (JSON-based)
- ✅ Publish/unpublish articles
- ✅ Feature articles on homepage
- ✅ Add tags and sources to articles
- ✅ Admin dashboard with statistics

## Project Structure

```
articles-app/
├── client/          # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Auth context
│   │   └── theme/         # MUI theme
│   └── package.json
├── server/          # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── models/        # Mongoose models
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   └── package.json
└── package.json     # Root package for running both
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID/slug
- `POST /api/articles` - Create article (admin)
- `PUT /api/articles/:id` - Update article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)
- `POST /api/articles/:id/view` - Increment view count

### Comments
- `GET /api/articles/:id/comments` - Get article comments
- `POST /api/articles/:id/comments` - Add comment
- `DELETE /api/articles/:articleId/comments/:commentId` - Delete comment

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID/slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Navigation
- `GET /api/navigation/:name` - Get navigation menu
- `PUT /api/navigation/:name` - Update navigation (admin)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in `server/.env`
- Change port in `client/vite.config.js`

### Module Not Found Errors
- Delete `node_modules` folders
- Run `npm install` again in both client and server

### CORS Issues
- Ensure the API URL in `client/.env` matches your server
- Check CORS configuration in `server/src/index.js`

## Production Deployment

### Build Frontend
```bash
cd client
npm run build
```
The built files will be in `client/dist/`

### Server Configuration
1. Set `NODE_ENV=production` in server `.env`
2. Use a secure `JWT_SECRET`
3. Configure proper MongoDB connection string
4. Set up file storage (local or S3)
5. Configure CORS for your domain

### Deployment Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean, AWS
- **Database**: MongoDB Atlas (recommended)

## Tech Stack Details

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **React Markdown** - Markdown rendering
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check MongoDB and Node.js logs

## License

MIT License - Feel free to use for personal or commercial projects!


# Quick Start Guide

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Setup Environment Files

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/articles_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
UPLOAD_DIR=./src/uploads
NODE_ENV=development
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

**Using Docker (easiest):**
```bash
docker-compose up -d
```

**Or use local MongoDB/Atlas** (see SETUP_GUIDE.md)

### 4. Initialize Database
```bash
npm run db:init
```
This will:
- Create default categories
- Create navigation menu
- Let you create an admin user

### 5. Run the Application
```bash
npm run dev
```

Visit: http://localhost:3000

Login with your admin credentials and go to http://localhost:3000/admin

## Key Features

✅ **Markdown Editor** with live preview  
✅ **Cover Image** uploads  
✅ **Categories** management  
✅ **Comments** system  
✅ **View Counter** for articles  
✅ **Dynamic Navigation** menu  
✅ **User Authentication**  
✅ **Admin Dashboard**  
✅ **Responsive Design** with Material-UI  

## Tech Stack

**Frontend:** React + Vite + MUI + React-Markdown  
**Backend:** Node.js + Express + MongoDB + JWT  

## Default Admin Routes

- `/admin` - Dashboard
- `/admin/articles/new` - Create Article
- `/admin/categories` - Manage Categories
- `/admin/navigation` - Manage Navigation

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions!


# Database Initialization Scripts

This project includes several utility scripts to help you manage the database and initial setup.

## 📋 Available Scripts

### 1. Complete Database Initialization (Recommended for first setup)

```bash
npm run db:init
```

**What it does:**
- ✅ Connects to MongoDB
- ✅ Creates default categories (Technology, Science, Health, Business, Lifestyle)
- ✅ Creates default navigation menu
- ✅ Prompts you to create an admin user
- ✅ Shows database status

**When to use:** First time setup or when you want to initialize everything at once.

**Example output:**
```
╔════════════════════════════════════════════╗
║   Database Initialization Script          ║
╚════════════════════════════════════════════╝

📡 Connecting to MongoDB...
✅ Connected to MongoDB

Current Database Status:
  Users: 0
  Categories: 0
  Navigation: 0

📁 Creating default categories...
  ✓ Technology
  ✓ Science
  ✓ Health
  ✓ Business
  ✓ Lifestyle

🧭 Creating default navigation...
  ✓ Main navigation created

👤 No admin user found. Let's create one!

Enter admin username: admin
Enter admin email: admin@example.com
Enter admin password: ********

✅ Admin user created successfully!
```

---

### 2. Seed Database (Categories & Navigation only)

```bash
npm run db:seed
```

**What it does:**
- ✅ Creates default categories
- ✅ Creates default navigation menu
- ❌ Does NOT create admin user

**When to use:** When you want to add default data but already have users set up.

---

### 3. Create Admin User

```bash
npm run db:create-admin
```

**What it does:**
- ✅ Prompts for username, email, and password
- ✅ Creates a new admin user
- ✅ Can also upgrade existing users to admin

**When to use:** 
- Create additional admin users
- Upgrade an existing user to admin role

**Interactive prompts:**
```
=== Create Admin User ===

Enter admin username: johndoe
Enter admin email: john@example.com
Enter admin password: ********

✅ Admin user created successfully!

Admin Details:
Username: johndoe
Email: john@example.com
Role: admin
```

---

### 4. Reset Database (⚠️ Dangerous)

```bash
npm run db:reset
```

**What it does:**
- ⚠️  **DELETES ALL DATA** from the database
- Removes all users, articles, categories, comments, and navigation

**When to use:** 
- Development/testing when you want a clean slate
- **NEVER use in production!**

**Safety confirmation:**
```
⚠️  WARNING: Database Reset Script

This will DELETE ALL DATA from the database!

Are you sure you want to continue? Type "yes" to confirm: 
```

---

## 🚀 Quick Start Workflow

### First Time Setup:

```bash
# 1. Install dependencies
npm run install-all

# 2. Setup environment files
# Create server/.env and client/.env (see SETUP_GUIDE.md)

# 3. Start MongoDB
docker-compose up -d

# 4. Initialize database (creates everything)
npm run db:init

# 5. Start the application
npm run dev
```

### If You Already Have a Database:

```bash
# Just create an admin user
npm run db:create-admin
```

---

## 📝 Script Details

### Location
All scripts are located in: `server/src/scripts/`

- `initDatabase.js` - Complete initialization
- `seedDatabase.js` - Seed categories and navigation
- `createAdmin.js` - Create/update admin users
- `resetDatabase.js` - Reset all data

### Running from Server Directory

You can also run scripts directly from the `server/` directory:

```bash
cd server

npm run db:init
npm run db:seed
npm run db:create-admin
npm run db:reset
```

---

## 🔐 Default Admin Credentials

**Important:** The scripts do NOT create default credentials. You must provide:
- Username (3-30 characters)
- Email (valid email format)
- Password (minimum 6 characters)

This ensures security and prevents default credentials in production.

---

## 🗃️ Default Categories Created

| Category | Icon | Color | Description |
|----------|------|-------|-------------|
| Technology | 💻 | Blue | Articles about technology, programming, and innovation |
| Science | 🔬 | Green | Scientific discoveries and research |
| Health | 🏥 | Red | Health tips and medical information |
| Business | 💼 | Orange | Business news and entrepreneurship |
| Lifestyle | 🎨 | Purple | Lifestyle, culture, and entertainment |

---

## 🧭 Default Navigation Menu

The default navigation includes:
- **Home** (/)
- **Articles** (/articles)
- **Categories** (/categories)

You can customize this later through the admin panel at `/admin/navigation`

---

## 🛠️ Troubleshooting

### "MongoDB connection error"
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `server/.env`
- For Docker: `docker-compose up -d`

### "User already exists"
- Use the update option to change user to admin
- Or use a different email/username

### Scripts hang or don't respond
- Press `Ctrl+C` to cancel
- Check MongoDB connection
- Ensure `.env` file exists in `server/` directory

---

## 💡 Tips

1. **Always run `db:init` first** for a fresh installation
2. **Keep your admin credentials safe** - they're not stored in the scripts
3. **Use `db:reset` only in development** - it deletes everything!
4. You can create **multiple admin users** by running `db:create-admin` multiple times
5. Scripts are **idempotent** - running them multiple times won't duplicate data

---

## 📚 Related Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [QUICK_START.md](./QUICK_START.md) - Quick 5-minute setup
- [README.md](./README.md) - Project overview

---

## Need Help?

If you encounter issues:
1. Check MongoDB is running: `docker ps` or check service status
2. Verify environment variables in `server/.env`
3. Check the terminal output for specific error messages
4. Ensure you're running commands from the project root directory


import mongoose from 'mongoose';
import readline from 'readline';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Article from '../models/Article.js';
import Comment from '../models/Comment.js';
import Navigation from '../models/Navigation.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const resetDatabase = async () => {
  try {
    console.log('⚠️  WARNING: Database Reset Script\n');
    console.log('This will DELETE ALL DATA from the database!\n');
    
    const confirm = await question('Are you sure you want to continue? Type "yes" to confirm: ');
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('\n❌ Operation cancelled');
      rl.close();
      process.exit(0);
    }

    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Deleting all data...');
    
    // Delete all collections
    await User.deleteMany({});
    console.log('  ✓ Users deleted');
    
    await Category.deleteMany({});
    console.log('  ✓ Categories deleted');
    
    await Article.deleteMany({});
    console.log('  ✓ Articles deleted');
    
    await Comment.deleteMany({});
    console.log('  ✓ Comments deleted');
    
    await Navigation.deleteMany({});
    console.log('  ✓ Navigation deleted');

    console.log('\n✅ Database reset complete!');
    console.log('\nRun the initialization script to set up fresh data:');
    console.log('  npm run db:init\n');

    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    await mongoose.disconnect();
    process.exit(1);
  }
};

resetDatabase();


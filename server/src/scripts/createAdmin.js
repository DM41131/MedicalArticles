import mongoose from 'mongoose';
import readline from 'readline';
import { config } from '../config/env.js';
import User from '../models/User.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Get admin details
    console.log('=== Create Admin User ===\n');
    
    const username = await question('Enter admin username: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      console.log('\n⚠️  User with this email or username already exists!');
      
      const update = await question('Do you want to update this user to admin? (yes/no): ');
      
      if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('\n✅ User updated to admin successfully!');
        console.log(`\nAdmin Details:`);
        console.log(`Username: ${existingUser.username}`);
        console.log(`Email: ${existingUser.email}`);
        console.log(`Role: ${existingUser.role}`);
      } else {
        console.log('\n❌ Operation cancelled');
      }
    } else {
      // Create new admin user
      const adminUser = await User.create({
        username,
        email,
        password,
        role: 'admin'
      });

      console.log('\n✅ Admin user created successfully!');
      console.log(`\nAdmin Details:`);
      console.log(`Username: ${adminUser.username}`);
      console.log(`Email: ${adminUser.email}`);
      console.log(`Role: ${adminUser.role}`);
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

createAdminUser();


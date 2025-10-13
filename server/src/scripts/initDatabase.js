import mongoose from 'mongoose';
import readline from 'readline';
import { config } from '../config/env.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Navigation from '../models/Navigation.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const initDatabase = async () => {
  try {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   Database Initialization Script          ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Check database status
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const navCount = await Navigation.countDocuments();

    console.log('Current Database Status:');
    console.log(`  Users: ${userCount}`);
    console.log(`  Categories: ${categoryCount}`);
    console.log(`  Navigation: ${navCount}\n`);

    // Seed categories if needed
    if (categoryCount === 0) {
      console.log('📁 Creating default categories...');
      const categories = [
        {
          name: 'Technology',
          description: 'Articles about technology, programming, and innovation',
          color: '#2196f3',
          icon: '💻',
          order: 1
        },
        {
          name: 'Science',
          description: 'Scientific discoveries and research',
          color: '#4caf50',
          icon: '🔬',
          order: 2
        },
        {
          name: 'Health',
          description: 'Health tips and medical information',
          color: '#f44336',
          icon: '🏥',
          order: 3
        },
        {
          name: 'Business',
          description: 'Business news and entrepreneurship',
          color: '#ff9800',
          icon: '💼',
          order: 4
        },
        {
          name: 'Lifestyle',
          description: 'Lifestyle, culture, and entertainment',
          color: '#9c27b0',
          icon: '🎨',
          order: 5
        }
      ];

      for (const categoryData of categories) {
        await Category.create(categoryData);
        console.log(`  ✓ ${categoryData.name}`);
      }
      console.log('');
    } else {
      console.log('✓ Categories already exist\n');
    }

    // Seed navigation if needed
    if (navCount === 0) {
      console.log('🧭 Creating default navigation...');
      await Navigation.create({
        name: 'main',
        items: [
          { label: 'Home', path: '/', icon: 'HomeIcon', order: 1, children: [] },
          { label: 'Articles', path: '/articles', icon: 'ArticleIcon', order: 2, children: [] }
        ]
      });
      console.log('  ✓ Main navigation created (Categories is now a dropdown)\n');
    } else {
      console.log('✓ Navigation already exists\n');
    }

    // Create admin user
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('👤 No admin user found. Let\'s create one!\n');
      
      const username = await question('Enter admin username: ');
      const email = await question('Enter admin email: ');
      const password = await question('Enter admin password (min 6 characters): ');

      if (password.length < 6) {
        console.log('\n❌ Password must be at least 6 characters long');
        rl.close();
        process.exit(1);
      }

      const adminUser = await User.create({
        username,
        email,
        password,
        role: 'admin'
      });

      console.log('\n✅ Admin user created successfully!');
      console.log(`\nAdmin Credentials:`);
      console.log(`  Username: ${adminUser.username}`);
      console.log(`  Email: ${adminUser.email}`);
      console.log(`  Role: ${adminUser.role}`);
    } else {
      console.log('✓ Admin user already exists');
      console.log(`  Username: ${adminExists.username}`);
      console.log(`  Email: ${adminExists.email}\n`);
      
      const createAnother = await question('Create another admin user? (yes/no): ');
      
      if (createAnother.toLowerCase() === 'yes' || createAnother.toLowerCase() === 'y') {
        const username = await question('Enter admin username: ');
        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password (min 6 characters): ');

        if (password.length < 6) {
          console.log('\n❌ Password must be at least 6 characters long');
          rl.close();
          process.exit(1);
        }

        const newAdmin = await User.create({
          username,
          email,
          password,
          role: 'admin'
        });

        console.log('\n✅ Additional admin user created!');
        console.log(`  Username: ${newAdmin.username}`);
        console.log(`  Email: ${newAdmin.email}`);
      }
    }

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   Database Initialization Complete! ✅     ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\nYou can now start the application with:');
    console.log('  npm run dev\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

initDatabase();


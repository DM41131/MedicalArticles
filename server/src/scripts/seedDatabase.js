import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Navigation from '../models/Navigation.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    console.log('=== Seeding Database ===\n');

    // Seed Categories
    console.log('📁 Creating categories...');
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
      const existing = await Category.findOne({ name: categoryData.name });
      if (!existing) {
        await Category.create(categoryData);
        console.log(`  ✓ Created category: ${categoryData.name}`);
      } else {
        console.log(`  ⚠ Category already exists: ${categoryData.name}`);
      }
    }

    // Seed Navigation
    console.log('\n🧭 Creating navigation...');
    const navigationData = {
      name: 'main',
      items: [
        {
          label: 'Home',
          path: '/',
          icon: 'HomeIcon',
          order: 1,
          children: []
        },
        {
          label: 'Articles',
          path: '/articles',
          icon: 'ArticleIcon',
          order: 2,
          children: []
        }
      ]
    };

    const existingNav = await Navigation.findOne({ name: 'main' });
    if (!existingNav) {
      await Navigation.create(navigationData);
      console.log('  ✓ Created main navigation');
    } else {
      console.log('  ⚠ Navigation already exists');
    }

    console.log('\n✅ Database seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();


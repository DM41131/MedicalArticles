import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';

const fixCategorySlugs = async () => {
  try {
    await connectDB();

    console.log('Fetching all categories...');
    const categories = await Category.find();

    console.log(`Found ${categories.length} categories`);

    let fixed = 0;
    for (const category of categories) {
      const originalSlug = category.slug;
      
      // Trigger slug regeneration by marking name as modified
      category.markModified('name');
      await category.save();

      if (originalSlug !== category.slug) {
        console.log(`✓ Fixed: "${category.name}"`);
        console.log(`  Old slug: "${originalSlug}" → New slug: "${category.slug}"`);
        fixed++;
      }
    }

    console.log(`\n✓ Fixed ${fixed} category slugs`);
    console.log(`✓ ${categories.length - fixed} categories were already correct`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing category slugs:', error);
    process.exit(1);
  }
};

fixCategorySlugs();


import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Article from '../models/Article.js';

const fixArticleSlugs = async () => {
  try {
    await connectDB();

    console.log('Fetching all articles...');
    const articles = await Article.find();

    console.log(`Found ${articles.length} articles`);

    let fixed = 0;
    for (const article of articles) {
      const originalSlug = article.slug;

      // Trigger slug regeneration by marking title as modified
      article.markModified('title');
      await article.save();

      if (originalSlug !== article.slug) {
        console.log(`✓ Fixed: "${article.title}"`);
        console.log(`  Old slug: "${originalSlug}" → New slug: "${article.slug}"`);
        fixed++;
      }
    }

    console.log(`\n✓ Fixed ${fixed} article slugs`);
    console.log(`✓ ${articles.length - fixed} articles were already correct`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing article slugs:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

fixArticleSlugs();


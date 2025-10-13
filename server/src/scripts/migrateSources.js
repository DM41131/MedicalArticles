import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Article from '../models/Article.js';

const migrateSources = async () => {
  try {
    await connectDB();

    console.log('Starting source field migration...');

    // Find all articles
    const articles = await Article.find();

    console.log(`Found ${articles.length} articles`);

    let migrated = 0;
    let skipped = 0;

    for (const article of articles) {
      // Get the raw document to check if it has the old 'source' field
      const rawArticle = article.toObject();

      // Check if article has old 'source' field and it's not empty
      if (rawArticle.source && typeof rawArticle.source === 'string' && rawArticle.source.trim()) {
        // Check if sources array doesn't already include this source
        if (!article.sources || !article.sources.includes(rawArticle.source.trim())) {
          article.sources = article.sources || [];
          article.sources.push(rawArticle.source.trim());

          // Remove old source field
          article.set('source', undefined, { strict: false });

          await article.save();

          console.log(`✓ Migrated: "${article.title}"`);
          console.log(`  Source: "${rawArticle.source}" → Sources: [${article.sources.join(', ')}]`);
          migrated++;
        } else {
          skipped++;
        }
      } else {
        skipped++;
      }
    }

    console.log(`\n✓ Migration complete!`);
    console.log(`✓ Migrated: ${migrated} articles`);
    console.log(`✓ Skipped: ${skipped} articles (no source or already migrated)`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error migrating sources:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

migrateSources();


import mongoose from 'mongoose';
import slugify from 'slugify';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    excerpt: {
      type: String,
      maxlength: 500,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Article category is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sources: [{
      type: String,
      trim: true,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
articleSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    // Use slugify with options that preserve non-Latin characters
    let generatedSlug = slugify(this.title, {
      lower: true,
      strict: false, // Allow special characters
      locale: 'ka', // Georgian locale support
      trim: true
    });

    // If slug is empty (all special chars removed), use transliteration
    if (!generatedSlug || generatedSlug.length === 0) {
      generatedSlug = slugify(this.title, {
        lower: true,
        strict: true,
        replacement: '-',
        remove: /[*+~.()'":@]/g // More aggressive removal for transliteration fallback
      });
    }

    // If still empty, use a timestamp-based fallback with title prefix
    if (!generatedSlug || generatedSlug.length === 0 || generatedSlug === '-') {
      generatedSlug = `article-${Date.now()}`;
    }

    // Check if slug already exists and make it unique
    let finalSlug = generatedSlug;
    let counter = 1;
    while (await mongoose.models.Article.findOne({ slug: finalSlug, _id: { $ne: this._id } })) {
      finalSlug = `${generatedSlug}-${counter}`;
      counter++;
    }

    this.slug = finalSlug;
    
    // Generate excerpt if not provided
    if (!this.excerpt && this.content) {
      this.excerpt = this.content
        .replace(/[#*`]/g, '')
        .substring(0, 200)
        .trim() + '...';
    }
  }
  next();
});

// Index for text search
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model('Article', articleSchema);


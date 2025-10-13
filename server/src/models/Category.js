import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: 50,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
    color: {
      type: String,
      default: '#1976d2',
    },
    icon: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    // Use slugify with options that preserve non-Latin characters
    let generatedSlug = slugify(this.name, {
      lower: true,
      strict: false, // Allow special characters
      locale: 'ka', // Georgian locale support
      trim: true
    });

    // If slug is empty (all special chars removed), use transliteration
    if (!generatedSlug || generatedSlug.length === 0) {
      generatedSlug = slugify(this.name, {
        lower: true,
        strict: true,
        replacement: '-',
        remove: /[*+~.()'"!:@]/g
      });
    }

    // If still empty, use a timestamp-based fallback
    if (!generatedSlug || generatedSlug.length === 0) {
      generatedSlug = `category-${Date.now()}`;
    }

    this.slug = generatedSlug;
  }
  next();
});

export default mongoose.model('Category', categorySchema);


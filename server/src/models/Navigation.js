import mongoose from 'mongoose';

const navigationItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  children: [{
    label: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  }],
}, { _id: false });

const navigationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },
    items: [navigationItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Navigation', navigationSchema);


import Category from '../models/Category.js';
import Article from '../models/Article.js';
import { AppError } from '../utils/error.js';
import slugify from 'slugify';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('order');

    // Add article count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const articleCount = await Article.countDocuments({ 
          category: category._id,
          published: true // Only count published articles
        });
        return {
          ...category.toObject(),
          articleCount,
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID or slug
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    let category;

    // Try to find by ID first, then by slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(req.params.id);
    } else {
      category = await Category.findOne({ slug: req.params.id });
    }

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Get article count for this category
    const articleCount = await Article.countDocuments({ category: category._id });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        articleCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } 
    });

    if (existingCategory) {
      return next(new AppError(`Category '${req.body.name}' already exists. Please use a different name.`, 400));
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // If name is being updated, check if it's unique
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return next(new AppError(`Category '${req.body.name}' already exists. Please use a different name.`, 400));
      }
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      category[key] = req.body[key];
    });

    // Save will trigger the pre-save hook to regenerate slug if name changed
    await category.save();

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Check if category has articles
    const articleCount = await Article.countDocuments({ category: category._id });

    if (articleCount > 0) {
      return next(
        new AppError('Cannot delete category with articles. Please reassign or delete articles first.', 400)
      );
    }

    await category.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};


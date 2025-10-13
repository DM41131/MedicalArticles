import Navigation from '../models/Navigation.js';
import { AppError } from '../utils/error.js';

// @desc    Get navigation
// @route   GET /api/navigation/:name
// @access  Public
export const getNavigation = async (req, res, next) => {
  try {
    const name = req.params.name || 'main';
    let navigation = await Navigation.findOne({ name });

    // Create default navigation if it doesn't exist
    if (!navigation) {
      navigation = await Navigation.create({
        name,
        items: [
          { label: 'Home', path: '/', icon: 'HomeIcon', order: 1 },
          { label: 'Articles', path: '/articles', icon: 'ArticleIcon', order: 2 },
        ],
      });
    }

    res.json({
      success: true,
      data: navigation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update navigation
// @route   PUT /api/navigation/:name
// @access  Private/Admin
export const updateNavigation = async (req, res, next) => {
  try {
    const name = req.params.name || 'main';
    const { items } = req.body;

    let navigation = await Navigation.findOne({ name });

    if (!navigation) {
      navigation = await Navigation.create({ name, items });
    } else {
      navigation.items = items;
      await navigation.save();
    }

    res.json({
      success: true,
      data: navigation,
    });
  } catch (error) {
    next(error);
  }
};


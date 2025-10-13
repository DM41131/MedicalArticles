import User from '../models/User.js';
import { AppError } from '../utils/error.js';
import { getPaginationParams, createPaginationResponse, paginate } from '../utils/paginate.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const { page, limit, sort } = getPaginationParams(req);

    const query = User.find();
    const total = await User.countDocuments();
    
    const users = await paginate(query, { page, limit, sort });

    res.json(createPaginationResponse(users, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const { username, email, bio, avatar } = req.body;

    // Check if user is updating their own profile or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this user', 403));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};


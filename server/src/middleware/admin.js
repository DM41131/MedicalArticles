import { AppError } from '../utils/error.js';

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return next(new AppError('Not authorized as an admin', 403));
  }
};


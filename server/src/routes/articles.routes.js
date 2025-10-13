import express from 'express';
import {
  searchArticles,
  getArticles,
  getArticleById,
  incrementViews,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleComments,
  addComment,
  deleteComment,
} from '../controllers/articles.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { upload } from '../services/storage.service.js';

const router = express.Router();

// Article routes
router.get('/search', searchArticles); // Must be before /:id route
router.get('/', optionalAuth, getArticles);
router.get('/:id', optionalAuth, getArticleById);
router.post('/:id/view', incrementViews);
router.post('/', protect, admin, upload.single('coverImage'), createArticle);
router.put('/:id', protect, admin, upload.single('coverImage'), updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

// Comment routes
router.get('/:id/comments', getArticleComments);
router.post('/:id/comments', protect, addComment);
router.delete('/:articleId/comments/:commentId', protect, deleteComment);

export default router;


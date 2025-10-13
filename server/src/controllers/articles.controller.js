import Article from '../models/Article.js';
import Comment from '../models/Comment.js';
import Category from '../models/Category.js';
import { AppError } from '../utils/error.js';
import { getPaginationParams, createPaginationResponse, paginate } from '../utils/paginate.js';

// @desc    Search articles (searches in title, excerpt, content, tags)
// @route   GET /api/articles/search
// @access  Public
export const searchArticles = async (req, res, next) => {
  try {
    const { page, limit, sort } = getPaginationParams(req);
    const { q, category } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json(createPaginationResponse([], 0, page, limit));
    }

    // Build search query - search in title, excerpt, content, and tags
    const searchQuery = {
      published: true, // Only search published articles for public
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    };

    // Add category filter if provided
    if (category) {
      searchQuery.category = category;
    }

    const total = await Article.countDocuments(searchQuery);
    const articles = await paginate(
      Article.find(searchQuery)
        .populate('category', 'name slug color icon')
        .populate('author', 'username avatar')
        .select('title excerpt coverImage category author createdAt views tags slug'),
      { page, limit, sort: sort || '-createdAt' }
    );

    // Get category counts for search results
    const categories = await Category.find().sort('order');
    const categoryCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Article.countDocuments({
          ...searchQuery,
          category: cat._id,
        });
        return {
          ...cat.toObject(),
          articleCount: count,
        };
      })
    );

    res.json({
      ...createPaginationResponse(articles, total, page, limit),
      categories: categoryCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res, next) => {
  try {
    const { page, limit, sort } = getPaginationParams(req);
    const { category, search, featured, published = 'true' } = req.query;

    // Build query
    const query = {};

    // Filter by published status (default to published only for public)
    if (!req.user || req.user.role !== 'admin') {
      query.published = true;
    } else if (published !== 'all') {
      query.published = published === 'true';
    }

    if (category) {
      query.category = category;
    }

    if (featured) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Article.countDocuments(query);
    const articles = await paginate(
      Article.find(query)
        .populate('category', 'name slug color')
        .populate('author', 'username avatar'),
      { page, limit, sort }
    );

    res.json(createPaginationResponse(articles, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get article by ID or slug
// @route   GET /api/articles/:id
// @access  Public
export const getArticleById = async (req, res, next) => {
  try {
    let article;

    // Try to find by ID first, then by slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(req.params.id)
        .populate('category', 'name slug color')
        .populate('author', 'username avatar bio');
    } else {
      article = await Article.findOne({ slug: req.params.id })
        .populate('category', 'name slug color')
        .populate('author', 'username avatar bio');
    }

    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    // Check if user can view unpublished articles
    if (!article.published && (!req.user || req.user.role !== 'admin')) {
      return next(new AppError('Article not found', 404));
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment article views
// @route   POST /api/articles/:id/view
// @access  Public
export const incrementViews = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    res.json({
      success: true,
      data: { views: article.views },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Private/Admin
export const createArticle = async (req, res, next) => {
  try {
    const articleData = {
      ...req.body,
      author: req.user._id,
    };

    // Parse tags if they come as JSON string
    if (articleData.tags && typeof articleData.tags === 'string') {
      try {
        articleData.tags = JSON.parse(articleData.tags);
      } catch (e) {
        articleData.tags = [];
      }
    }

    // Parse sources if they come as JSON string
    if (articleData.sources && typeof articleData.sources === 'string') {
      try {
        articleData.sources = JSON.parse(articleData.sources);
      } catch (e) {
        articleData.sources = [];
      }
    }

    // Handle cover image upload
    if (req.file) {
      articleData.coverImage = `/uploads/${req.file.filename}`;
    }

    const article = await Article.create(articleData);

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
export const updateArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    // Parse tags if they come as JSON string
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (e) {
        req.body.tags = [];
      }
    }

    // Parse sources if they come as JSON string
    if (req.body.sources && typeof req.body.sources === 'string') {
      try {
        req.body.sources = JSON.parse(req.body.sources);
      } catch (e) {
        req.body.sources = [];
      }
    }

    // Handle cover image upload
    if (req.file) {
      req.body.coverImage = `/uploads/${req.file.filename}`;
    }

    article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    // Delete all comments for this article
    await Comment.deleteMany({ article: article._id });

    await article.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Recursive function to get all nested replies
const getRepliesRecursive = async (commentId) => {
  const replies = await Comment.find({ parentComment: commentId })
    .populate('user', 'username avatar')
    .sort('createdAt');

  // Recursively get replies for each reply
  const repliesWithNestedReplies = await Promise.all(
    replies.map(async (reply) => {
      const nestedReplies = await getRepliesRecursive(reply._id);
      return {
        ...reply.toObject(),
        replies: nestedReplies,
      };
    })
  );

  return repliesWithNestedReplies;
};

// @desc    Get article comments
// @route   GET /api/articles/:id/comments
// @access  Public
export const getArticleComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ article: req.params.id, parentComment: null })
      .populate('user', 'username avatar')
      .sort('-createdAt');

    // Get all nested replies recursively
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await getRepliesRecursive(comment._id);
        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    res.json({
      success: true,
      data: commentsWithReplies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to article
// @route   POST /api/articles/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    const comment = await Comment.create({
      article: req.params.id,
      user: req.user._id,
      content: req.body.content,
      parentComment: req.body.parentComment || null,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/articles/:articleId/comments/:commentId
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this comment', 403));
    }

    // Delete replies as well
    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};


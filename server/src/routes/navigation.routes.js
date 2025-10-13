import express from 'express';
import {
  getNavigation,
  updateNavigation,
} from '../controllers/navigation.controller.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.get('/:name?', getNavigation);
router.put('/:name?', protect, admin, updateNavigation);

export default router;


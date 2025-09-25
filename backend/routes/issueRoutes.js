import express from 'express';
import {
  createIssue,
  getIssues,
  getIssue,
  getStats,
  voteIssue,
  addComment
} from '../controllers/issueController.js';
import upload from '../config/multer.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateIssue, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getIssues);
router.get('/stats', getStats);
router.get('/:id', optionalAuth, validateObjectId('id'), getIssue);


// Image upload route (for cloudinary)
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, message: 'Image upload failed' });
  }
  res.json({ success: true, url: req.file.path });
});

// Protected routes
router.post('/', authenticate, validateIssue, createIssue);
router.post('/:id/vote', authenticate, validateObjectId('id'), voteIssue);
router.post('/:id/comments', authenticate, validateObjectId('id'), addComment);

export default router;
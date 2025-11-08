import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentUpvote,
  createCommentValidation,
  updateCommentValidation,
} from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All comment routes are nested under issues
router.get('/issues/:issueId/comments', getComments);
router.post('/issues/:issueId/comments', protect, createCommentValidation, createComment);

// Direct comment routes
router.put('/:id', protect, updateCommentValidation, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/upvote', protect, toggleCommentUpvote);

export default router;

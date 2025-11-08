import express from 'express';
import {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  toggleUpvote,
  getIssueStats,
  createIssueValidation,
  updateIssueValidation,
} from '../controllers/issueController';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getIssues);
router.get('/stats', getIssueStats);
router.get('/:id', optionalAuth, getIssue);

// Protected routes
router.post('/', protect, createIssueValidation, createIssue);
router.put('/:id', protect, updateIssueValidation, updateIssue);
router.delete('/:id', protect, deleteIssue);
router.post('/:id/upvote', protect, toggleUpvote);

export default router;

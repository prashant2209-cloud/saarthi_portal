import express from 'express';
import {
    getIssues,
    createIssue,
    getIssueById,
    updateIssue,
    deleteIssue,
    upvoteIssue,
    getStats,
} from '../controllers/issueController';
import { auth, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', optionalAuth, getIssues);
router.post('/', auth, createIssue);
router.get('/stats', getStats);
router.get('/:id', optionalAuth, getIssueById);
router.put('/:id', auth, updateIssue);
router.delete('/:id', auth, deleteIssue);
router.put('/:id/upvote', auth, upvoteIssue);

export default router;

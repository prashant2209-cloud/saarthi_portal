import express from 'express';
import { getComments, createComment, deleteComment } from '../controllers/commentController';
import { auth, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.get('/:issueId', optionalAuth, getComments);
router.post('/:issueId', auth, createComment);
router.delete('/:id', auth, deleteComment);

export default router;

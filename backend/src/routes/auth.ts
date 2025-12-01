import express from 'express';
import { getProfile, updateProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/me', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router;

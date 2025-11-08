import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  registerValidation,
  loginValidation,
  updateProfileValidation,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, updateProfile);

export default router;

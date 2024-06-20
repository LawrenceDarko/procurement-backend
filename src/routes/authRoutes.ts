// src/routes/authRoutes.ts
import express from 'express';
import { login, logoutUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.get('/logout', protect(), logoutUser);


export default router;

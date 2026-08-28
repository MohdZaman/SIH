import express from 'express';
import { getAIResponse } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js'; 

const router = express.Router();


router.post('/ask', protect, getAIResponse);

export default router;
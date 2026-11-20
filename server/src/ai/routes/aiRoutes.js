
import express from 'express';
import { chatWithAI } from '../controller/aicontroller.js';
const router = express.Router();

// POST /api/ai/chat
router.post('/chat', chatWithAI);
export default router;

import express from 'express';
import {askBot} from '../controllers/bot.controller.js';

const router = express.Router();

// Express API for frontend integration
router.post('/ask', askBot);

export default router;
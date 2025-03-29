import express from 'express';
import { createCheckoutSession } from '../controllers/payment.controller.js'; // Import your controller function
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create-checkout-session', verifyToken, createCheckoutSession); // Define your payment route

export default router;

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoute from './routes/comment.route.js';
import paymentRoutes from './routes/payment.route.js'; // Import your payment routes
import botRoute from './routes/bot.route.js';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('mongodb is connected!!');
    })
    .catch(err => {
        console.log("database connection error: ", err);
    });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',  // Allow requests from all origins
    credentials: true,
  }));
  


//console.log("stripe api key ",process.env.STRIPE_SECRET_KEY);


app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoute);
app.use('/api/payment', paymentRoutes); // Use your payment routes here
app.use('/api/bot', botRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

import express from 'express';

import { signup, signin, google } from '../controllers/auth.controller.js';

const router = express.Router();

//creating account
router.post('/signup', signup);

//login
router.post('/signin', signin);

//sign-in/sign-up via google auth firebase
router.post('/google', google);

export default router;
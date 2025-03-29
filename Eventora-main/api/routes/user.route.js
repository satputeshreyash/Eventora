import express from 'express';

import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';
import { signout , getUsers, getUser, getUserParticipations } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);

router.put('/update/:userId',verifyToken,  updateUser);

router.delete('/delete/:userId', verifyToken, deleteUser);

router.post('/signout', signout);

//below is for getting all the users for admin dashboard
router.get('/getusers', verifyToken, getUsers);

//go through CommentSection.jsx and Comment.jsx
//below is for getting user who commented on posts
router.get('/:userId', getUser);

router.get('/:userId/participations', getUserParticipations);

export default router;
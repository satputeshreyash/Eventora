import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getposts , deletepost, updatepost, getAllPostsForAdmin, generateSummary} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);//verifyToken, checks if the user is authenticacted 
//as we have added isAdmin property while creaating a cookie when the user sign in along with it's id
//isAdmin property can be either false or true depends we have given authority to be admin in the database

//anyone can see the posts so no need to verify token
router.get('/getposts', getposts);

//while deleting a post, we have to make sure that the user is the owner of that post, and he is the admin and he is authenticated
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);

router.put('/updatepost/:postId/:userId', verifyToken, updatepost);

router.get('/getAllPostsForAdmin/:userId', verifyToken, getAllPostsForAdmin);

router.post('/generate-summary/:postId', verifyToken, generateSummary);

export default router;
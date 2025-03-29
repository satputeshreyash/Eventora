import jwt from 'jsonwebtoken';
import {errorHandler} from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;//access_token is the name of the cookie, go through auth.controller.js
    if(!token){
        return next(errorHandler(401, 'You are not authenticated!'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err){
            return next(errorHandler(401, 'Unauthorized'));
        }

        req.user = user;
        next();//if the user is authenicated then go to the next middleware e.g now he/she can update the profile if he/she is authenticated
        //and we add the user to the req object
    })
}
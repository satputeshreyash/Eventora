import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working'
    });
}

export const updateUser = async (req, res, next) => {
    // req.user contains the id, we get it from the token (go through verifyUser.js)
    // req.params.userId, we get it from the route (user.route.js)
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You can only update your own profile!'));
    }

    try {
        const updates = {};

        if (req.body.password) {
            if (req.body.password.length < 6) {
                return next(errorHandler(400, 'Password must be at least 6 characters!'));
            }
            updates.password = bcryptjs.hashSync(req.body.password, 10);
        }

        if (req.body.username) {
            if (req.body.username.length < 7 || req.body.username.length > 20) {
                return next(errorHandler(400, 'Username must be between 7 and 20 characters!'));
            }
            if (req.body.username.includes(' ')) {
                return next(errorHandler(400, 'Username cannot contain spaces!'));
            }
            if (req.body.username !== req.body.username.toLowerCase()) {
                return next(errorHandler(400, 'Username must be lowercase!'));
            }
            if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
                return next(errorHandler(400, 'Username can only contain letters and numbers!'));
            }
            updates.username = req.body.username;
        }

        if (req.body.email) {
            updates.email = req.body.email;
        }

        if (req.body.profilePicture) {
            updates.profilePicture = req.body.profilePicture;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updates },
            { new: true } // If you don't write new: true, then it will return old data and not the updated one to the user
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found!'));
        }

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);

    } catch (error) {
        return next(error);
    }
};


//delete user
export const deleteUser = async(req, res, next) => {
    // req.user contains the id, we get it from the token (go through verifyUser.js)
    // req.params.userId, we get it from the route (user.route.js)
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this user!'));
    }

    try {
        await User.findByIdAndDelete(req.params.userId);

        res.status(200).json('User has been deleted');
    } catch (error) {
        return next(error);
    }
}


//signout 
export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out!');
    } catch (error) {
        return next(error);
    }
}


//get users, eg. for showing users to admin dashboard
export const getUsers = async(req, res, next) => {

    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to get all users!'));
    }
     
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });    

        const totalUsers = await User.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );  

        const lastMonthUsers = await User.countDocuments({
            createdAt: {
                $gte: oneMonthAgo
            }
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        });
        

    } catch (error) {
        return next(error);
    }
}


//get user who commented on a post
export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if(!user){
            return next(errorHandler(404, 'User not found!'));
        }
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        return next(error);
    }
}


//get users participations
export const getUserParticipations = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user and populate their participations
        const user = await User.findById(userId)
            .populate({
                path: "participations.mainEventId",
                select: "image title slug", // Select only the necessary fields
            })
            .lean();

        // Check if the user was found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Format the participation data
        const participations = user.participations.map((participation) => ({
            mainEvent: participation.mainEventId,
            subEvents: participation.subEvents.map((subEvent) => ({
                subEventId: subEvent.subEventId,
                eventName: subEvent.eventName,
                eventPrice: subEvent.eventPrice,
            })),
        }));

        res.status(200).json(participations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
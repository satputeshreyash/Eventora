import User from '../models/user.model.js';
import brcyptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if(!username || !email || 
        !password || username === "" || 
        email === "" || password === ""
    ){
       return next(errorHandler(400, 'All fields are required to be filled!'));//custome error handling
        //first the call go to the custome error handling function where we return the error and that error is then 
        //passed to the error handling middleware in index.js file using next() keyword
    }

    const hashedPassword = brcyptjs.hashSync(password, 10);//also you can do this using await

    //creating a new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });


    try {
        await newUser.save();//store user into database
       // console.log("user",newUser);
        res.json("Signup successful!");

    } catch (error) {
       return next(error);
    }//this next will lead to the custome error handling middleware in index.js file

}


//login
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password || email === "" || password === ""){
       return next(errorHandler(400, 'All fields are required to be filled!'));//custome error handling
    }

    try {
        const validUser = await User.findOne({ email });

        if(!validUser){
           return next(errorHandler(404, 'User not found!'));//custome error handling
        }

        const validPassword = brcyptjs.compareSync(password, validUser.password);
 
        if(!validPassword){
           return next(errorHandler(400, 'Invalid credentials!'));//custome error handling
        }

        const token = jwt.sign(
            { id: validUser._id , isAdmin: validUser.isAdmin},
            process.env.JWT_SECRET    
        )

        //it separates password and other fields as we don't want to send back the password to the user
        const { password: pass, ...rest} = validUser._doc;

        //send the cookie to the user 
        //name of the cookie is access_token
        //this cookie is nothing but the encrypted id of user's id
        res.status(200).cookie('access_token', token, 
            { httpOnly: true}).json(rest);//in response we will send the details of authenticated user
            //that data will be stored into redux for global state management

    } catch (error) {
       return next(error);
    }

}
 

//google auth
export const google = async (req, res, next) => {
    const {name, email, googlePhotoUrl } = req.body;
   // console.log(googlePhotoUrl);

    try {
        const user = await User.findOne({email});

        //if the user is already exist
        if(user){
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);

            const {password, ...rest} = user._doc;

            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest);

        } else{//create a new user
            const generatedPassword = Math.random().toString(36).slice(-8) + 
                                      Math.random().toString(36).slice(-8);
            const hashedPassword = brcyptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + 
                          Math.random().toString(9).slice(-4),
                //Sahand Ghavid => sahandghavid1625(username will be created randomly, with removing space, and adding random number at the end)
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);

            const {password, ...rest} = newUser._doc;

            res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true
            })
            .json(rest);
        }

    } catch (error) {
        next(error)
    }
}
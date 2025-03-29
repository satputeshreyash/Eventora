import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg"
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    participations: [
        {
            mainEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Reference to the Post model
            subEvents: [
                {
                    subEventId: { type: mongoose.Schema.Types.ObjectId, required: true }, // The ID of the sub-event from the Post schema
                    eventName: { type: String, required: true }, // Name of the sub-event
                    eventPrice: { type: Number, required: true }, // Price of the sub-event
                },
            ],
        },
    ],
}, {timestamps: true}
);

//User is the name of the model, it will automatically named as Users in database
const User = mongoose.model('User', userSchema);

export default User;


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true 
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     profilePicture: {
//         type: String,
//         default: "https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg"
//     },
//     isAdmin:{
//         type: Boolean,
//         default: false
//     },
// }, {timestamps: true}
// );

// //User is the name of the model, it will automatically named as Users in database
// const User = mongoose.model('User', userSchema);

// export default User;
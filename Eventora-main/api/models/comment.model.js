import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    likes: {//this likes array contains user id's who liked the comment
        type: Array,
        default: []
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },

}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
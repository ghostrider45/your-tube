import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    videoid: {type: String, required: true},
    userid: {type: String, required: true},
    commentbody: {type: String, required: true},
    usercommented: {type: String, required: true},
    userlocation: {type: String},
    commenton: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: String  // Store user IDs who liked
    }],
    dislikedBy: [{
        type: String  // Store user IDs who disliked
    }]
});

export default mongoose.model("Comments", commentSchema);



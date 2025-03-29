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
    }
});

export default mongoose.model("Comments", commentSchema);


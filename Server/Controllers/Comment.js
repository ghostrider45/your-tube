import comment from "../Models/comment.js";
import mongoose from "mongoose";
import axios from "axios"; // For making API requests

export const postcomment = async (req, res) => {
    const { videoid, userid, commentbody, usercommented, location } = req.body;

    const userlocation = location?.city 
        ? `${location.city}, ${location.state}` 
        : "Unknown";

    const postcomment = new comment({ 
        videoid, 
        userid, 
        commentbody, 
        usercommented, 
        userlocation,
        commenton: new Date()
    });

    try {
        await postcomment.save();
        res.status(200).json({ message: "Comment posted successfully!" });
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const likeComment = async (req, res) => {
    const { id: _id } = req.params;
    const userId = req.userId; // From auth middleware

    if (!mongoose.Types.ObjectId.isValid(_id)) 
        return res.status(400).send("Invalid Comment ID");

    try {
        const commentDoc = await comment.findById(_id);
        
        if (!commentDoc) 
            return res.status(404).send("Comment not found");

        // Check if user already liked
        const alreadyLiked = commentDoc.likedBy.includes(userId);
        // Check if user previously disliked
        const previouslyDisliked = commentDoc.dislikedBy.includes(userId);

        let updateQuery = {};

        if (alreadyLiked) {
            // Unlike if already liked
            updateQuery = {
                $inc: { likes: -1 },
                $pull: { likedBy: userId }
            };
        } else {
            // Add like and remove from dislikes if previously disliked
            updateQuery = {
                $inc: { 
                    likes: 1,
                    dislikes: previouslyDisliked ? -1 : 0
                },
                $push: { likedBy: userId },
                $pull: { dislikedBy: userId }
            };
        }

        const updatedComment = await comment.findByIdAndUpdate(
            _id,
            updateQuery,
            { new: true }
        );

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const dislikeComment = async (req, res) => {
    const { id: _id } = req.params;
    const userId = req.userId; // From auth middleware

    if (!mongoose.Types.ObjectId.isValid(_id)) 
        return res.status(400).send("Invalid Comment ID");

    try {
        const commentDoc = await comment.findById(_id);
        
        if (!commentDoc) 
            return res.status(404).send("Comment not found");

        // Check if user already disliked
        const alreadyDisliked = commentDoc.dislikedBy.includes(userId);
        // Check if user previously liked
        const previouslyLiked = commentDoc.likedBy.includes(userId);

        let updateQuery = {};

        if (alreadyDisliked) {
            // Remove dislike if already disliked
            updateQuery = {
                $inc: { dislikes: -1 },
                $pull: { dislikedBy: userId }
            };
        } else {
            // Add dislike and remove from likes if previously liked
            updateQuery = {
                $inc: { 
                    dislikes: 1,
                    likes: previouslyLiked ? -1 : 0
                },
                $push: { dislikedBy: userId },
                $pull: { likedBy: userId }
            };
        }

        const updatedComment = await comment.findByIdAndUpdate(
            _id,
            updateQuery,
            { new: true }
        );

        // Check if comment should be deleted (2 or more dislikes)
        if (updatedComment.dislikes >= 2) {
            await comment.findByIdAndDelete(_id);
            return res.status(200).json({ 
                message: "Comment deleted due to dislikes",
                deleted: true
            });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const getcomment = async (req, res) => {
    try {
        const commentlist = await comment.find();
        res.status(200).send(commentlist);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const deletecomment = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send("Comments unavailable.");
    }
    try {
        await comment.findByIdAndDelete(_id);
        res.status(200).json({ message: "Comment deleted successfully!" });
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const editcomment = async (req, res) => {
    const { id: _id } = req.params;
    const { commentbody } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send("Comments unavailable.");
    }
    try {
        const updatedComment = await comment.findByIdAndUpdate(
            _id,
            { $set: { commentbody } },
            { new: true }
        );
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(400).json(error.message);
    }
};




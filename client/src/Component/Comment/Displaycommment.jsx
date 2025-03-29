import React, { useState } from "react";
import "./Comment.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { editcomment, deletecomment, likeComment, dislikeComment } from "../../action/comment";
import { translateText } from "../../utils/translate";
import { AiFillLike, AiFillDislike, AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';

const Displaycommment = ({ 
    cid, 
    commentbody, 
    userid, 
    commenton, 
    usercommented, 
    userlocation,
    likes = 0,
    dislikes = 0,
    likedBy = [],
    dislikedBy = []
}) => {
    const dispatch = useDispatch();
    const currentuser = useSelector((state) => state.currentuserreducer);
    const [edit, setedit] = useState(false);
    const [cmtnody, setcommentbdy] = useState("");
    const [translatedComment, setTranslatedComment] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [originalComment] = useState(commentbody); // Store the original comment

    const hasLiked = currentuser?.result && likedBy.includes(currentuser.result._id);
    const hasDisliked = currentuser?.result && dislikedBy.includes(currentuser.result._id);

    const handleLike = () => {
        if (!currentuser?.result) {
            alert("Please login to like comments");
            return;
        }
        dispatch(likeComment(cid));
    };

    const handleDislike = () => {
        if (!currentuser?.result) {
            alert("Please login to dislike comments");
            return;
        }
        dispatch(dislikeComment(cid));
    };

    const languages = [
        { code: "en", name: "English" },
        { code: "hi", name: "Hindi" },
        { code: "ta", name: "Tamil" },
        { code: "te", name: "Telugu" },
        { code: "kn", name: "Kannada" },
        { code: "ml", name: "Malayalam" },
        { code: "mr", name: "Marathi" },
        { code: "bn", name: "Bengali" },
        { code: "gu", name: "Gujarati" },
        { code: "pa", name: "Punjabi" },
    ];

    const handleTranslate = async () => {
        if (selectedLanguage === "en") {
            setTranslatedComment(""); // Reset to original comment
            return;
        }
        const translatedText = await translateText(originalComment, selectedLanguage);
        setTranslatedComment(translatedText);
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        
        if (newLanguage === "en") {
            setTranslatedComment(""); // Reset to original comment
        }
    };

    const formatTimestamp = (timestamp) => {
        return moment(timestamp).fromNow();
    };

    const formatCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!cmtnody) {
            alert("Please enter a comment");
            return;
        }
        dispatch(editcomment({
            id: cid,
            commentbody: cmtnody
        }));
        setedit(false);
    };

    return (
        <>
            {edit ? (
                <>
                    <form className="edit_comment_form" onSubmit={handleEdit}>
                        <input
                            type="text"
                            onChange={(e) => setcommentbdy(e.target.value)}
                            placeholder="Edit comment..."
                            value={cmtnody}
                            className="comment_ibox"
                        />
                        <input type="submit" value="Save" className="comment_add_btn_comments" />
                    </form>
                </>
            ) : (
                <>
                    <p className="comment_body">{translatedComment || originalComment}</p>
                    <p className="usercommented">
                        {usercommented} commented from {userlocation || "Unknown"} • {formatTimestamp(commenton)}
                    </p>
                    <div className="comment_actions">
                        <div className="like-dislike-container">
                            <button 
                                className={`action-btn ${hasLiked ? 'active' : ''}`} 
                                onClick={handleLike}
                                title="Like"
                            >
                                <div className="like-count-wrapper">
                                    {hasLiked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
                                    {likes > 0 && <span className="count-display">{formatCount(likes)}</span>}
                                </div>
                            </button>
                            <button 
                                className={`action-btn ${hasDisliked ? 'active' : ''}`} 
                                onClick={handleDislike}
                                title="Dislike"
                            >
                                <div className="like-count-wrapper">
                                    {hasDisliked ? <AiFillDislike size={20} /> : <AiOutlineDislike size={20} />}
                                    {dislikes > 0 && <span className="count-display">{formatCount(dislikes)}</span>}
                                </div>
                            </button>
                        </div>
                        <div className="translation-controls">
                            <select 
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                className="language-select"
                            >
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                            <button 
                                onClick={handleTranslate}
                                className="translate-btn"
                            >
                                Translate
                            </button>
                        </div>
                        {currentuser?.result?._id === userid && (
                            <div className="comment-owner-actions">
                                <button className="action-btn" onClick={() => setedit(true)}>Edit</button>
                                <button className="action-btn" onClick={() => dispatch(deletecomment(cid))}>Delete</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Displaycommment;








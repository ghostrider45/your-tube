import React, { useState } from "react";
import "./Comment.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { editcomment, deletecomment, likeComment, dislikeComment } from "../../action/comment";
import { translateText } from "../../utils/translate";

const Displaycommment = ({ cid, commentbody, userid, commenton, usercommented, userlocation }) => {
    const [edit, setedit] = useState(false);
    const [cmtnody, setcommentbdy] = useState("");
    const [translatedComment, setTranslatedComment] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("hi");
    const dispatch = useDispatch();
    const currentuser = useSelector((state) => state.currentuserreducer);

    const languages = [
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
        const translatedText = await translateText(commentbody, selectedLanguage);
        setTranslatedComment(translatedText);
    };

    const formatTimestamp = (timestamp) => {
        const now = moment();
        const commentTime = moment(timestamp);
        const diffMinutes = now.diff(commentTime, 'minutes');
        const diffHours = now.diff(commentTime, 'hours');
        const diffDays = now.diff(commentTime, 'days');

        if (diffMinutes < 1) {
            return 'just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDays < 30) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else {
            return commentTime.format('MMM D, YYYY');
        }
    };

    return (
        <>
            {edit ? (
                <>
                    <form className="comments_sub_form_comments" onSubmit={(e) => {
                        e.preventDefault();
                        if (cmtnody) {
                            dispatch(editcomment({ id: cid, commentbody: cmtnody }));
                            setcommentbdy("");
                            setedit(false);
                        } else {
                            alert("Please type your comment!");
                        }
                    }}>
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
                <p className="comment_body">{translatedComment || commentbody}</p>
            )}

            <p className="usercommented">
                {usercommented} commented from {userlocation || "Unknown"} • {formatTimestamp(commenton)}
            </p>

            {currentuser?.result?._id === userid && (
                <div className="comment_actions">
                    <select
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        value={selectedLanguage}
                        className="language-dropdown"
                    >
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <button className="action-btn" onClick={handleTranslate}>Translate</button>
                    <button className="action-btn" onClick={() => dispatch(likeComment(cid))}>Like</button>
                    <button className="action-btn" onClick={() => dispatch(dislikeComment(cid))}>Dislike</button>
                    <button className="action-btn" onClick={() => setedit(true)}>Edit</button>
                    <button className="action-btn" onClick={() => dispatch(deletecomment(cid))}>Delete</button>
                </div>
            )}
        </>
    );
};

export default Displaycommment;



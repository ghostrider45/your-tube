import React, { useState } from "react";
import "./Comment.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { editcomment, deletecomment, likeComment, dislikeComment } from "../../action/comment";
import { translateText } from "../../utils/translate"; // Import translation function

const Displaycommment = ({ cid, commentbody, userid, commenton, usercommented, userlocation }) => {
    const [edit, setedit] = useState(false); // Toggle edit mode
    const [cmtnody, setcommentbdy] = useState(""); // Edited comment body
    const [translatedComment, setTranslatedComment] = useState(""); // Translated text
    const [selectedLanguage, setSelectedLanguage] = useState("hi"); // Default language selection
    const dispatch = useDispatch();
    const currentuser = useSelector((state) => state.currentuserreducer);

    // List of Indian languages supported for translation
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

    // Handle translating the comment
    const handleTranslate = async () => {
        const translatedText = await translateText(commentbody, selectedLanguage);
        setTranslatedComment(translatedText);
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
                - {usercommented} from {userlocation} commented {moment(commenton).fromNow()}
            </p>

            {currentuser?.result?._id === userid && (
                <p className="EditDel_DisplayCommendt">
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
                    <button onClick={handleTranslate}>Translate</button>
                    <button onClick={() => dispatch(likeComment(cid))}>Like</button>
                    <button onClick={() => dispatch(dislikeComment(cid))}>Dislike</button>
                    <button onClick={() => setedit(true)}>Edit</button>
                    <button onClick={() => dispatch(deletecomment(cid))}>Delete</button>
                </p>
            )}
        </>
    );
};

export default Displaycommment;

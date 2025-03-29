import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VideoCall from '../../Component/VideoCall/VideoCall';
import './VideoCallPage.css';

const VideoCallPage = () => {
  const [friendId, setFriendId] = useState('');
  const [showCall, setShowCall] = useState(false);
  const [myId, setMyId] = useState('');
  const currentUser = useSelector(state => state.currentuserreducer);

  useEffect(() => {
    if (currentUser?.result?._id) {
      setMyId(currentUser.result._id);
    }
  }, [currentUser]);

  const startCall = () => {
    if (friendId.trim()) {
      setShowCall(true);
    }
  };

  if (!currentUser?.result) {
    return (
      <div className="videocall-page">
        <h2>Please login to use video call feature</h2>
      </div>
    );
  }

  return (
    <div className="videocall-page">
      {!showCall ? (
        <div className="videocall-init">
          <h2>Start a Video Call</h2>
          <div className="user-id-display">
            <p>Your ID: <span className="id-text">{myId}</span></p>
            <button 
              onClick={() => navigator.clipboard.writeText(myId)}
              className="copy-button"
            >
              Copy ID
            </button>
          </div>
          <div className="call-input">
            <input
              type="text"
              placeholder="Enter friend's ID"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
            />
            <button onClick={startCall}>Start Call</button>
          </div>
          <p className="help-text">
            Share your ID with friends so they can call you, or enter their ID to call them.
          </p>
        </div>
      ) : (
        <VideoCall 
          friendId={friendId}
          onClose={() => setShowCall(false)}
        />
      )}
    </div>
  );
};

export default VideoCallPage;

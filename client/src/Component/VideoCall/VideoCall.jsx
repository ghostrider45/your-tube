import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import './VideoCall.css';
import { 
    AiOutlinePhone, 
    AiOutlineVideoCamera, 
    AiFillAudio, 
    AiOutlineAudioMuted, 
    AiOutlineClose 
} from 'react-icons/ai';

function VideoCall({ friendId, onClose }) {
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const currentUser = useSelector((state) => state.currentuserreducer);
    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();
    const peerRef = useRef();

    useEffect(() => {
        socket.current = io("http://localhost:5000");

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setStream(stream);
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;
                }
            });

        socket.current.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (socket.current) {
                socket.current.disconnect();
            }
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, []);

    const callPeer = (id) => {
        peerRef.current = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peerRef.current.on("signal", data => {
            socket.current.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: currentUser.result._id
            });
        });

        peerRef.current.on("stream", stream => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
            }
        });

        socket.current.on("callAccepted", signal => {
            setCallAccepted(true);
            peerRef.current.signal(signal);
        });
    };

    const acceptCall = () => {
        setCallAccepted(true);
        peerRef.current = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peerRef.current.on("signal", data => {
            socket.current.emit("acceptCall", { signal: data, to: caller });
        });

        peerRef.current.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
        });

        peerRef.current.signal(callerSignal);
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = isVideoOff;
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <div className="video-call-container">
            <div className="video-grid">
                <div className="video-player">
                    <video playsInline muted ref={userVideo} autoPlay />
                    <div className="video-label">You</div>
                </div>
                {callAccepted && (
                    <div className="video-player">
                        <video playsInline ref={partnerVideo} autoPlay />
                        <div className="video-label">Friend</div>
                    </div>
                )}
            </div>

            <div className="controls">
                <button onClick={toggleMute}>
                    {isMuted ? <AiOutlineAudioMuted /> : <AiFillAudio />}
                </button>
                <button onClick={toggleVideo}>
                    <AiOutlineVideoCamera style={{ color: isVideoOff ? 'red' : 'white' }} />
                </button>
                {!callAccepted && (
                    <button onClick={() => callPeer(friendId)}>
                        <AiOutlinePhone />
                    </button>
                )}
                {receivingCall && !callAccepted && (
                    <button onClick={acceptCall}>
                        Accept Call
                    </button>
                )}
                <button onClick={onClose} className="end-call">
                    <AiOutlineClose />
                </button>
            </div>
        </div>
    );
}

export default VideoCall;


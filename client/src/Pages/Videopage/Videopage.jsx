import React, { useEffect, useRef, useState } from "react";
import "./Videopage.css";
import moment from "moment";
import Likewatchlatersavebtns from "./Likewatchlatersavebtns";
import { useParams, Link, useNavigate } from "react-router-dom";
import Comment from "../../Component/Comment/Comment";
import { viewvideo, getallvideo } from "../../action/video";
import { addtohistory } from "../../action/history";
import { useSelector, useDispatch } from "react-redux";
import { setcurrentuser } from "../../action/currentuser"; 

const Videopage = () => {
  const { vid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const commentRef = useRef(null);
  const [taps, setTaps] = useState([]);
  const timeoutRef = useRef(null);
  
  const vids = useSelector((state) => state.videoreducer);
  const vv = vids?.data.filter((q) => q._id === vid)[0];
  const currentuser = useSelector((state) => state.currentuserreducer);
  const [updatedPoints, setUpdatedPoints] = useState(currentuser?.result?.points || 0); 

  const handleViews = () => {
    dispatch(viewvideo({ id: vid }));
  };

  const handleHistory = () => {
    dispatch(
      addtohistory({
        videoid: vid,
        viewer: currentuser?.result._id,
      })
    );
  };

  const handleVideoCompletion = () => {
    const pointsEarned = 5; // Points for completing the video
    const newPoints = updatedPoints + pointsEarned;
    
    setUpdatedPoints(newPoints);  // Update points locally

    // Dispatch an action to update the points in the current user
    dispatch(setcurrentuser({
      ...currentuser,
      result: {
        ...currentuser.result,
        points: newPoints, // Add updated points to the current user
      },
    }));
  };

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleSeek = (direction) => {
    const seekTime = 10;
    if (direction === "forward") {
      videoRef.current.currentTime += seekTime;
    } else if (direction === "backward") {
      videoRef.current.currentTime -= seekTime;
    }
  };

  const scrollToComments = () => {
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const goToRandomVideo = async () => {
    try {
      // Fetch latest videos
      await dispatch(getallvideo());
      
      // Get all videos except current one
      const otherVideos = vids?.data.filter(video => video._id !== vid);
      
      if (otherVideos && otherVideos.length > 0) {
        // Select a random video from the filtered list
        const randomIndex = Math.floor(Math.random() * otherVideos.length);
        const randomVideo = otherVideos[randomIndex];
        
        console.log("Navigating to random video:", randomVideo._id);
        navigate(`/videopage/${randomVideo._id}`, { replace: true });
      } else {
        console.log("No other videos available");
      }
    } catch (error) {
      console.error("Error navigating to random video:", error);
    }
  };

  const handleTripleTap = (region) => {
    switch (region) {
      case "left":
        scrollToComments();
        break;
      case "middle":
        goToRandomVideo();
        break;
      case "right":
        window.location.href = '/';
        break;
      default:
        break;
    }
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
    const now = Date.now();
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    // Determine click region
    const region = clickX > (2 * width) / 3 ? "right" : 
                  clickX < width / 3 ? "left" : "middle";

    // Add new tap with timestamp and region
    setTaps(prevTaps => {
      const newTaps = [...prevTaps, { time: now, region }];
      
      // Only keep taps within last 500ms
      const recentTaps = newTaps.filter(tap => now - tap.time <= 500);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set timeout to handle taps
      timeoutRef.current = setTimeout(() => {
        const tapCount = recentTaps.length;
        const lastRegion = recentTaps[recentTaps.length - 1].region;

        if (tapCount === 1) {
          handlePlayPause();
        } else if (tapCount === 2) {
          if (lastRegion === "right") {
            handleSeek("forward");
          } else if (lastRegion === "left") {
            handleSeek("backward");
          }
        } else if (tapCount === 3) {
          handleTripleTap(lastRegion);
        }

        // Clear taps after handling
        setTaps([]);
      }, 500);

      return recentTaps;
    });
  };

  useEffect(() => {
    if (currentuser) {
      handleHistory();
    }
    handleViews();
    
    // Initial fetch of videos
    dispatch(getallvideo());

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Listen for navigation changes
  useEffect(() => {
    if (vv) {
      handleViews();
      if (currentuser) {
        handleHistory();
      }
    }
  }, [vid]);

  return (
    <>
      <div className="container_videoPage">
        <div className="container2_videoPage">
          <div className="video_display_screen_videoPage">
            <div className="video_player_custom" onClick={handleVideoClick}>
              <video
                ref={videoRef}
                src={`http://localhost:5000/${vv?.filepath}`}
                className="video_ShowVideo_videoPage"
                controls
                onEnded={handleVideoCompletion} // Handle video completion
              ></video>
            </div>
            <div className="video_details_videoPage">
              <div className="video_btns_title_VideoPage_cont">
                <p className="video_title_VideoPage">{vv?.title}</p>
                <div className="views_date_btns_VideoPage">
                  <div className="views_videoPage">
                    {vv?.views} views <div className="dot"></div>{" "}
                    {moment(vv?.createdat).fromNow()}
                  </div>
                  <Likewatchlatersavebtns vv={vv} vid={vid} />
                </div>
              </div>
              <Link to={"/"} className="chanel_details_videoPage">
                <b className="chanel_logo_videoPage">
                  <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
                </b>
                <p className="chanel_name_videoPage">{vv.uploader}</p>
              </Link>
              <div className="comments_VideoPage" ref={commentRef}>
                <h2>
                  <u>Comments</u>
                </h2>
                <Comment videoid={vv._id} />
              </div>
            </div>
          </div>
          <div className="moreVideoBar">More videos</div>
        </div>
      </div>
    </>
  );
};

export default Videopage;
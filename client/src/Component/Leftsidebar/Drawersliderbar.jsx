import React from 'react'
import "./Leftsidebar.css"
import { AiOutlineHome } from 'react-icons/ai'
import { MdOutlineExplore, MdOutlineVideoLibrary, MdSubscriptions } from "react-icons/md"
import { BsCameraVideo } from 'react-icons/bs'
import shorts from "./shorts.png"
import { NavLink } from 'react-router-dom'
const Drawersliderbar = ({ toggledraw, toggledrawersidebar }) => {
  return (
    <div className="container_DrawaerLeftSidebar" style={toggledrawersidebar}>
      <div className="container2_DrawaerLeftSidebar">
        <NavLink to={'/'} className="icon_sidebar_div">
          <p>
            <AiOutlineHome size={22} className='icon_sidebar' style={{ margin: "auto 0.7rem" }} />
            <div className="text_sidebar_icon">Home</div>
          </p>
        </NavLink>
        <div className="icon_sidebar_div">
          <p>
            <MdOutlineExplore size={22} className='icon_sidebar' style={{ margin: "auto 0.7rem" }} />
            <div className="text_sidebar_icon">Explore</div>
          </p>
        </div>
        <div className="icon_sidebar_div">
          <p>
            <img src={shorts} width={22} className='icon_sidebar' style={{ margin: "auto 0.7rem" }} alt="shorts" />
            <div className="text_sidebar_icon">Shorts</div>
          </p>
        </div>
        <div className="icon_sidebar_div">
          <p>
            <MdSubscriptions size={22} className='icon_sidebar' style={{ margin: "auto 0.7rem" }} />
            <div className="text_sidebar_icon">Subscriptions</div>
          </p>
        </div>
        <NavLink to={'/Library'} className="icon_sidebar_div">
          <p>
            <MdOutlineVideoLibrary size={22} className='icon_sidebar' style={{ margin: "auto 0.7rem" }} />
            <div className="text_sidebar_icon">Library</div>
          </p>
        </NavLink>
        <NavLink to={'/videocall'} className="icon_sidebar_div">
          <p>
            <BsCameraVideo size={22} className='icon_sidebar' style={{ margin: "auto 0.7rem" }} />
            <div className="text_sidebar_icon">Video Call</div>
          </p>
        </NavLink>
      </div>
      <div className="container3_DrawaerLeftSidebar" onClick={() => toggledraw()}></div>
    </div>
  )
}

export default Drawersliderbar

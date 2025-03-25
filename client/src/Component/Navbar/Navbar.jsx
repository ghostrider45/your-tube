import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClerk, useUser } from "@clerk/clerk-react";
import { jwtDecode } from "jwt-decode";
import { login } from "../../action/auth";
import { setcurrentuser } from "../../action/currentuser";
import logo from "./logo.ico";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { RiVideoAddLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import Searchbar from "./Searchbar/Searchbar";
import Auth from "../../Pages/Auth/Auth";
import axios from "axios";

const Navbar = ({ toggledrawer, seteditcreatechanelbtn }) => {
  const [authbtn, setauthbtn] = useState(false);
  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.currentuserreducer);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (user) {
      const userEmail = user.primaryEmailAddress.emailAddress;
      dispatch(login({ email: userEmail }));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const token = currentuser?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }
    const storedProfile = localStorage.getItem("Profile");
    if (storedProfile) {
      dispatch(setcurrentuser(JSON.parse(storedProfile)));
    }
  }, [currentuser?.token, dispatch]);

  const logout = () => {
    dispatch(setcurrentuser(null));
    localStorage.clear();
  };

  return (
    <>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={toggledrawer}>
            <p></p>
            <p></p>
            <p></p>
          </div>
          <Link to="/" className="logo_div_Navbar">
            <img src={logo} alt="Your-Tube Logo" />
            <p className="logo_title_navbar">Your-Tube</p>
          </Link>
        </div>
        <Searchbar />
        <RiVideoAddLine size={22} className="vid_bell_Navbar" />
        <div className="apps_Box">
          {Array.from({ length: 9 }).map((_, index) => (
            <p key={index} className="appBox"></p>
          ))}
        </div>
        <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />
        <div className="Auth_cont_Navbar">
          {currentuser?.result ? (
            <div className="Chanel_logo_App" onClick={() => setauthbtn(true)}>
              <p className="fstChar_logo_App">
                {currentuser.result.name
                  ? currentuser.result.name.charAt(0).toUpperCase()
                  : currentuser.result.email.charAt(0).toUpperCase()}
              </p>
            </div>
          ) : (
            <p className="Auth_Btn" onClick={() => openSignIn()}>
              <BiUserCircle size={22} />
              <b>Sign in</b>
            </p>
          )}
        </div>
      </div>
      {authbtn && (
        <Auth
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          setauthbtn={setauthbtn}
          user={currentuser}
        />
      )}
    </>
  );
};

export default Navbar;




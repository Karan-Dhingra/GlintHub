import React from "react";
import { Link } from "react-router-dom";
import { GoogleAuthLogin, GoogleAuthLogout } from "../config/firebase";
import { AuthState } from "../config/firebaseauth";

export default function Header() {
    const currentUser = AuthState().currentUser
    const handleGoogleAuthLogin = async () => {
        try {
          await GoogleAuthLogin()
        } catch (error) {
          console.log(error);
        }
      }
      const handleGoogleAuthLogout = async () => {
        try {
          await GoogleAuthLogout()
        } catch (error) {
          console.log(error);
        }
      }
    return (
        <div id="header">
            <div className="header_pos">
                <Link to="/">
                    <div className="logo">
                        <img src="./logo.png" alt="logo" />
                        <Link to="/">
                            <p className="logo_heading">Google Developer Student Clubs</p>
                            <p className="logo_content">Chandigarh University</p>
                        </Link>
                    </div>
                </Link>
                <ul className="header_options">
                    <li>
                        <a className="header_link" href="">About GDSC</a>
                    </li>
                    <li>
                        <a className="header_link" href="">Projects</a>
                    </li>
                    <li>
                        <a className="header_link" href="">Events</a>
                    </li>
                    <li>
                        <a className="header_link" href="/glinthub">GlintHub</a>
                    </li>
                    <li>
                        <a className="header_link" href="">Our Team</a>
                    </li>
                    {currentUser ? <div id="header_profile"><li>
                        <a className="header_link"><img className="profile_img" src={currentUser.photoURL}
                            alt="" /></a>
                    </li><div className="header_dropdown">
                        <li>
                            <a>Profile</a>
                        </li>
                        <li>
                            <a href="/glinthub" onClick={handleGoogleAuthLogout}>Log out</a>
                        </li>
                        </div></div> : <li>
                        <a className="header_link" onClick={handleGoogleAuthLogin}>Join US</a>
                    </li>}
                    
                </ul>
            </div>
        </div>
    );
}
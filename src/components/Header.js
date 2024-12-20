// src/components/Header.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.error("No user data found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="logo-section">
        <h1 className="site-logo" onClick={() => navigate("/yt-outlier")}>
          ViralVideoSpy
        </h1>
      </div>
      <button className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </button>
      <div className="site-menu-container">
        <nav className={`site-menu ${menuOpen ? "open" : ""}`}>
          <ul className="nav-items">
            <li className="nav-item">
              <Link to="/yt-outlier" className="nav-item-link">
                YouTube Outlier
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/youtube-title-generator" className="nav-item-link">
                YouTube Title Generator
              </Link>
            </li>
            {/* <li className="nav-item">
            <Link to="/instagram-hooks-generator" className="nav-item-link">
              Instagram Hooks Generator
            </Link>
          </li> */}
          </ul>
        </nav>

        <div className="profile-section" ref={dropdownRef}>
          <img
            src={userData?.photoURL || "https://via.placeholder.com/40"}
            alt="Profile"
            className="profile-icon"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                onClick={() => navigate("/profile")}
                className="dropdown-item"
              >
                Profile
              </button>
              <button onClick={handleSignOut} className="dropdown-item">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

// src/components/Header.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const user = auth.currentUser; // Get the current logged-in user
  const [userData, setUserData] = useState(null); // State to store user data from Firestore
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for dropdown menu

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
      navigate("/"); // Redirect to the login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close the dropdown if clicked outside
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
      {user && (
        <>
          <nav className="site-nav">
            <ul className="nav-items">
              <li className="nav-item">
                <Link to="/" className="nav-item-link">
                  YouTube Outlier
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/youtube-title-generator" className="nav-item-link">
                  YouTube Title Generator
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/instagram-hooks-generator" className="nav-item-link">
                  Instagram Hooks Generator
                </Link>
              </li>
            </ul>
          </nav>

          <div className="profile-menu" ref={dropdownRef}>
            <img
              src={userData?.photoURL || "https://via.placeholder.com/40"} // Default image if no photoURL
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
        </>
      )}
    </header>
  );
}

export default Header;

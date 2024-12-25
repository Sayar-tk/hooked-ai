import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [remainingCredits, setRemainingCredits] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Fetch user data and set up a real-time listener for credits
  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      // Real-time listener for user data
      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserData(data);
            setRemainingCredits(data.remainingCredits || 0); // Default to 0 if not available
          } else {
            console.error("User document does not exist.");
          }
        },
        (error) => {
          console.error("Error listening to Firestore document:", error);
        }
      );

      // Cleanup listener on component unmount
      return () => unsubscribe();
    }
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

  // Collapse menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.classList.contains("hamburger-menu")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
      <div className="site-menu-container" ref={menuRef}>
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
          </ul>
        </nav>

        {/* Display Remaining Credits */}
        <div className="credits-display">
          {remainingCredits !== null ? (
            <span className="credits-text">Credits: {remainingCredits}</span>
          ) : (
            <span className="credits-text">Loading Credits...</span>
          )}
        </div>

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

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
function Header() {
  return (
    <header className="site-header">
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
    </header>
  );
}

export default Header;

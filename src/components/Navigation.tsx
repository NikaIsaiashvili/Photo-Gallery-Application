import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navigation.css";

const AppNavigation = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        მთავარი
      </Link>
      <Link to="/history" className="nav-link">
        ისტორია
      </Link>
    </nav>
  );
};
export default AppNavigation;

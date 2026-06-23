import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./style.css";

function index() {
    const [menuOpen, setMenuOpen] = useState(false)
    return (

        <nav className="navbar">
            <div className="logo">
                <h2>Obsidian Estate</h2>
            </div>

            {/* Hamburger Button */}
            <button
                className="menu-toggle"
                onClick={() =>setMenuOpen(!menuOpen)}
            >
                ☰
            </button>

            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                <li><a href="/">Home</a></li>
                <li><a href="/browse">Browse</a></li>
                <li><a href="/saved" className="active-link">Saved</a></li>
                <li><a href="/about">About</a></li>

                <div className="mobile-buttons">
                    <button className="login-btn">Log In</button>
                    <button className="signup-btn">Sign Up</button>
                </div>
            </ul>

            <div className="nav-actions">
                <button className="login-btn">Log In</button>
                <button className="signup-btn">Sign Up</button>
            </div>
        </nav>
    )
}

export default index;
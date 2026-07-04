import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";

function index() {
    const [menuOpen, setMenuOpen] = useState(false)
    const accessToken = localStorage.getItem('accessToken')
    const user_role = localStorage.getItem('userRole')
    const userRole = localStorage.getItem('userRole')
    const navigate = useNavigate()

    function handleReload() {
        navigate('/')
        window.location.reload();
    }
    return (

        <nav className="navbar">
            <div className="logo">
                <h2>MintFizo</h2>
            </div>

            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                <li><Link to={'/'}>Home</Link></li>
                <li><Link to={'/browse'}>Browse</Link></li>
                <li><Link to={'/saved'}>Saved</Link></li>
                <li><Link to={'/'}>About</Link></li>
            </ul>

            <div className="left-side">
                {
                    user_role === "seller" && <Link to={'/dashboard'}><i class="bi bi-bar-chart dashboard-icon"></i></Link>
                }
                {
                    accessToken && (user_role === "seller" ? <Link to={'/sellernotification'}><i class="bi bi-bell notification-icon"></i></Link> : 
                    <Link to={'/notification'}><i class="bi bi-bell notification-icon"></i></Link>)
                }
                {
                    accessToken ? (
                        userRole === "buyer" ?
                            <Link to={'/profile'}><i className="bi bi-person-circle profile-icon"></i></Link> :
                            <Link to={'/seller/profile'}><i className="bi bi-person-circle profile-icon"></i></Link>
                    ) : (
                        <div className="nav-actions">
                            <button className="login-btn" onClick={handleReload}>Log In</button>
                        </div >
                    )
                }
            </div>

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>
        </nav >
    )
}

export default index;
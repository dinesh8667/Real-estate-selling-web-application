import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './style.css';

function Index() {
  const [userType, setUserType] = useState("buyer");
  const [userInput, setUserInput] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  function handleChange(e) {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Attempting to register:", { ...userInput, userType });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        email: userInput.email,
        password: userInput.password,
        role: userType
      });

      console.log("Success!", response.data);
      navigate('/login');

    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Failed to register. Please check your details and try again.");
    }
  }

  return (
    <div className="login-page">
      <div className="background-glow"></div>

      <div className="login-card">
        <h1>Register Here</h1>
        <p>Sign up to access your saved properties.</p>

        <div className="toggle-container">
          <button
            type="button" 
            className={`toggle-btn ${userType === "buyer" ? "active" : ""}`}
            onClick={() => setUserType("buyer")}
          >
            Buyer
          </button>

          <button
            type="button" 
            className={`toggle-btn ${userType === "seller" ? "active" : ""}`}
            onClick={() => setUserType("seller")}
          >
            Seller
          </button>
        </div>

        {/* The form calls handleSubmit when the Register button is clicked */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input onChange={handleChange} name='email' type="email" placeholder="Enter your email" required/>
          </div>

          <div className="input-group">
            <div className="password-header">
              <label>Password</label>
              <span className="forgot">Forgot?</span>
            </div>
            <input onChange={handleChange} name='password' type="password" placeholder="Enter your password" required/>
          </div>

          <button type="submit" className="signin-btn">
            Register as {userType}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button type="button" className="google-btn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
            alt="Google"
          />
          Sign in with Google
        </button>

        <p className="signup-text">
          Already have an account? <Link to={'/login'}><span>Sign In</span></Link>
        </p>
      </div>
    </div>
  );
}

export default Index;
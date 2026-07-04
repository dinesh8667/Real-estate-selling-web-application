import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './style.css';

function Index() {
  const [userType, setUserType] = useState("buyer");
  
  // 1. Expanded state to hold all the new database fields
  const [userInput, setUserInput] = useState({
    user_name: '', // Changed from 'name' to match Django
    email: '', 
    password: '',
    phone_number: '',
    agency_name: '',
    bio: ''
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Attempting to register:", { ...userInput, role: userType });

    try {
      // 2. Send the full payload to our updated Django serializer
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        email: userInput.email,
        password: userInput.password,
        role: userType,
        user_name: userInput.user_name,
        phone_number: userInput.phone_number,
        // Only send these if they are registering as a seller
        agency_name: userType === 'seller' ? userInput.agency_name : '',
        bio: userType === 'seller' ? userInput.bio : ''
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

      <div className="login-card" style={{ maxWidth: '500px' }}> {/* Slightly wider to fit the new fields */}
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

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Full Name</label>
            <input 
              onChange={handleChange} 
              name='user_name' 
              value={userInput.user_name}
              type="text" 
              placeholder="Enter your name" 
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              onChange={handleChange} 
              name='email' 
              value={userInput.email}
              type="email" 
              placeholder="Enter your email" 
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input 
              onChange={handleChange} 
              name='phone_number' 
              value={userInput.phone_number}
              type="text" 
              placeholder="Enter your phone number" 
            />
          </div>

          {/* 3. Conditional Rendering: Only show these if 'Seller' is selected */}
          {userType === "seller" && (
            <>
              <div className="input-group">
                <label>Agency Name (Optional)</label>
                <input 
                  onChange={handleChange} 
                  name='agency_name' 
                  value={userInput.agency_name}
                  type="text" 
                  placeholder="e.g. Obsidian Luxury Group" 
                />
              </div>
              
              <div className="input-group">
                <label>Professional Bio (Optional)</label>
                <textarea 
                  onChange={handleChange} 
                  name='bio' 
                  value={userInput.bio}
                  placeholder="Tell buyers a bit about your experience..." 
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    minHeight: '80px',
                    resize: 'vertical',
                    marginTop: '8px',
                    outline: 'none'
                  }}
                />
              </div>
            </>
          )}

          <div className="input-group">
            <div className="password-header">
              <label>Password</label>
            </div>
            <input 
              onChange={handleChange} 
              name='password' 
              value={userInput.password}
              type="password" 
              placeholder="Enter your password" 
              required
            />
          </div>

          <button type="submit" className="signin-btn" style={{ marginTop: '20px' }}>
            Register as {userType}
          </button>
        </form>

        <p className="signup-text">
          Already have an account? <Link to={'/login'}><span>Sign In</span></Link>
        </p>
      </div>
    </div>
  );
}

export default Index;
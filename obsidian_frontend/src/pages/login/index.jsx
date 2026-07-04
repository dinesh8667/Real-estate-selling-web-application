import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import axios from 'axios';

function Index() {
  const [userType, setUserType] = useState("buyer");
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMessage(''); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors on new submission
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: credentials.email,
        password: credentials.password
      });

      // 1. Grab the actual account type from the Django response
      const isActuallySeller = response.data.is_seller;
      
      // 2. Determine what they clicked on the frontend
      const tryingToLoginAsSeller = userType === "seller";

      // 3. THE STRICT ROLE CHECK
      if (isActuallySeller !== tryingToLoginAsSeller) {
        setErrorMessage(`Access denied. This email is not registered as a ${userType}.`);
        return; // Abort the function immediately so tokens aren't saved
      }

      // 4. If the check passes, save the tokens safely
      console.log(response.data);
      
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user_id',response.data.user_id)
      localStorage.setItem('userRole', userType);
      localStorage.setItem('isSeller', isActuallySeller);

      // (Optional) Store the custom name we added earlier if it exists
      if (response.data.user_name) {
        localStorage.setItem('userName', response.data.user_name);
      }

      navigate('/');

    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="background-glow"></div>

      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Sign in to access your saved properties.</p>

        <div className="toggle-container">
          <button
            type="button" // Prevents the button from submitting the form
            className={`toggle-btn ${userType === "buyer" ? "active" : ""}`}
            onClick={() => {
              setUserType("buyer");
              setErrorMessage(''); // Clear errors on toggle
            }}
          >
            Buyer
          </button>

          <button
            type="button" // Prevents the button from submitting the form
            className={`toggle-btn ${userType === "seller" ? "active" : ""}`}
            onClick={() => {
              setUserType("seller");
              setErrorMessage(''); // Clear errors on toggle
            }}
          >
            Seller
          </button>
        </div>

        {/* Display the error message if one exists */}
        {errorMessage && (
          <div style={{ color: '#ff6b6b', background: 'rgba(255, 0, 0, 0.08)', border: '1px solid rgba(255, 0, 0, 0.2)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              onChange={handleChange} 
              name='email' 
              type="email" 
              placeholder="Enter your email" 
              required
            />
          </div>

          <div className="input-group">
            <div className="password-header">
              <label>Password</label>
              <span className="forgot">Forgot?</span>
            </div>

            <input 
              onChange={handleChange} 
              name='password' 
              type="password" 
              placeholder="Enter your password" 
              required
            />
          </div>

          <button type="submit" className="signin-btn">
            Sign In as {userType}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <Link to={'/signup'}><span>Sign up</span></Link>
        </p>
      </div>
    </div>
  );
}

export default Index;
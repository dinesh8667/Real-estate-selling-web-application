import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './style.css'
import axios from 'axios';

function index() {
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
    console.log("Attempting login for:", credentials.email);

    try {
      // Send the login request to the Django JWT endpoint
      // Note: Django's default JWT expects 'username' and 'password'
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: credentials.email, // We used email as the username during registration!
        password: credentials.password
      });

      console.log("Django sent back:", response.data);

      console.log("Login successful!");

      // Lock the VIP tokens inside the browser's localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('userRole', userType); // Save if they logged in as buyer or seller
      localStorage.setItem('isSeller', response.data.is_seller);

      // Redirect them to the Dashboard!
      navigate('/dashboard');

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
            className={`toggle-btn ${userType === "buyer" ? "active" : ""}`}
            onClick={() => setUserType("buyer")}
          >
            Buyer
          </button>

          <button
            className={`toggle-btn ${userType === "seller" ? "active" : ""}`}
            onClick={() => setUserType("seller")}
          >
            Seller
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input onChange={handleChange} name='email' type="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <div className="password-header">
              <label>Password</label>
              <span className="forgot">Forgot?</span>
            </div>

            <input onChange={handleChange} name='password' type="password" placeholder="Enter your password" />
          </div>

          <button type="submit" className="signin-btn">
            Sign In as {userType}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="google-btn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
            alt="Google"
          />
          Sign in with Google
        </button>

        <p className="signup-text">
          Don't have an account? <Link to={'/signup'}><span>Sign up</span></Link>
        </p>
      </div>
    </div>
  );
}

export default index
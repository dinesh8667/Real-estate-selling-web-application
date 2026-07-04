import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios'
import "./style.scss";

function ProfileSettings() {
  const base_url = "http://127.0.0.1:8000/api/profile/"
  const token = localStorage.getItem('accessToken');

  const [currentData, setCurrentData] = useState({
    user_name: "",
    agency_name: "",
    email: "",
    phone_number: "",
    bio: "",
  })

  const [formData, setFormData] = useState({
    user_name: "",
    agency_name: "",
    email: "",
    phone_number: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`${base_url}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCurrentData({
          user_name: response.data.user_name || "",
          agency_name: response.data.agency_name || "",
          email: response.data.email || "",
          phone_number: response.data.phone_number || "",
          bio: response.data.bio || "",
        });

      } catch (error) {
        console.error("Failed to fetch profile:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token expired or missing!");
        }
      }
    }
    fetchUserData();
  }, []); 

  useEffect(() => {
    setFormData({
      user_name: currentData.user_name || "",
      agency_name: currentData.agency_name || "",
      email: currentData.email || "",
      phone_number: currentData.phone_number || "",
      bio: currentData.bio || "",
    });
  }, [currentData])

  async function handleSubmit() {
    try {
      await axios.put(`${base_url}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert("Profile updated")
    } catch (error) {
      alert(error)
    }
  }

  function handleLogout() {
    localStorage.clear()
    window.location.reload();
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="page-heading">
          <h1>Profile & Settings</h1>
          <p>
            Manage your agent identity and professional details.
          </p>
        </div>

        <div className="profile-card">

          <div className="avatar-section">
            <div className="avatar">
              <i class="bi bi-person-circle"></i>
            </div>

            <div className="avatar-content">
              <h2>Welcome {formData.user_name}</h2>
              
            </div>
          </div>

          <div className="divider"></div>

          <div className="form-grid">

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group full-width">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="divider"></div>

          <div className="btn-section">
            <button className="logout-btn" onClick={handleLogout}><i class="bi bi-box-arrow-left"></i> Log Out</button>
            <button className="save-btn" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
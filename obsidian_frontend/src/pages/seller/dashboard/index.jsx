import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.css";

function Dashboard() {
    // 1. Set up state for our dynamic data
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 2. Fetch data when the component loads
    useEffect(() => {
        const fetchMyProperties = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                // Call your Django API, passing the VIP token in the headers
                const response = await axios.get('http://127.0.0.1:8000/api/properties/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setProperties(response.data);
                setIsLoading(false);

            } catch (error) {
                console.error("Error fetching properties:", error);
                // If the token is invalid or expired, boot them back to login
                if (error.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                }
                setIsLoading(false);
            }
        };

        console.log(properties)

        fetchMyProperties();
    }, [navigate]);

    return (
        <div className="management-container">
            <div className="heading-section">
                <h1>Property Management</h1>
                <div className="line"></div>

                <p>
                    Manage your exclusive listings, track views, and update statuses
                    from your centralized seller dashboard.
                </p>
            </div>

            <div className="table-wrapper">
                <div className="table-header">
                    <input
                        type="text"
                        placeholder="🔍 Search properties..."
                        className="search-box"
                    />

                    <div className="header-actions">
                        <button className="filter-btn">Filter</button>
                        <Link to={'/addlisting'}><button className="new-btn">+ New Listing</button></Link>
                    </div>
                </div>

                <div className="table-responsive">
                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#892cdc" }}>
                            Loading your portfolio...
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Views</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {properties.map((property, index) => (
                                    <tr key={property.id}>
                                        <td>
                                            {/* If your Django API doesn't send a main image yet, we use a fallback */}
                                            <img
                                                // We just grab Django's direct URL, and keep the fallback just in case!
                                                src={property.main_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"}
                                                alt={property.title}
                                                className="property-image"
                                                style={{ objectFit: 'cover', width: '100px', height: '70px', borderRadius: '8px' }}
                                            />
                                        </td>

                                        <td>
                                            <h4
                                                className={
                                                    property.status === "Sold" ? "strike-text" : ""
                                                }
                                            >
                                                {property.title}
                                            </h4>
                                            {/* Using the city from your Django model as the address */}
                                            <p>{property.city}</p>
                                        </td>

                                        <td>
                                            {/* Format the raw Django decimal into a clean dollar amount */}
                                            ${parseFloat(property.price).toLocaleString()}
                                        </td>

                                        <td>
                                            <span
                                                className={`status ${property.status ? property.status.toLowerCase() : "draft"}`}
                                            >
                                                {property.status || "Draft"}
                                            </span>
                                        </td>

                                        {/* Defaulting to 0 views if the backend doesn't provide it yet */}
                                        <td>{property.views || 0}</td>

                                        <td>
                                            <button className="action-btn">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* Fallback if the seller has no properties yet */}
                                {properties.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "gray" }}>
                                            You don't have any properties listed yet. Click "+ New Listing" to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="pagination">
                    <span>Showing {properties.length > 0 ? 1 : 0} to {properties.length} of {properties.length} entries</span>

                    <div>
                        <button>Prev</button>
                        <button className="active-page">1</button>
                        <button>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
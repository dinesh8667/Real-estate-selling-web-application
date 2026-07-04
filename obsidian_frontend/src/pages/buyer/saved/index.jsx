import React, { useEffect, useState } from "react";
import {
    FaHeart,
    FaBed,
    FaBath,
    FaRulerCombined,
} from "react-icons/fa";
import { Link } from 'react-router-dom'
import axios from "axios";
import "./style.scss";

function SavedProperties() {
    const token = localStorage.getItem('accessToken')
    const [savedProperties, setSavedProperties] = useState([])

    useEffect(() => {
        async function fetchData(params) {
            const response = await axios.get('http://127.0.0.1:8000/api/saved-properties/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

                .then((res) => {
                    setSavedProperties(res.data)
                    console.log(res.data);

                })
        }

        fetchData()
    }, [token])

    return (
        <section className="saved-page">
            <div className="saved-container">

                <div className="saved-header">
                    <div>
                        <h1>Saved Properties</h1>
                        <div className="title-line"></div>
                    </div>

                    <span>{savedProperties?.length} Properties</span>
                </div>

                {
                    savedProperties.length == 0 ? 
                    <div className="no-saved">
                        <h1>0 Saved Properties</h1> 
                    </div> :
                        <div className="saved-grid">
                            {savedProperties?.map((property) => (
                                <Link to={`/property/${property.property_details.id}`}>
                                    <div className="saved-card" key={property.id}>

                                        <div className="saved-image">
                                            <img
                                                src={property.property_details.main_image}
                                                alt={property.property_details.address}
                                            />

                                            <div className="card-tags">
                                                <span className="status-tag">
                                                    {property.property_details.status}
                                                </span>
                                                <span className="new-tag">
                                                    {property.property_details.property_type_name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="saved-content">
                                            <h2>{property.property_details.title}</h2>
                                            <h3>₹ {property.property_details.price}</h3>
                                            <p>{property.property_details.address}</p>

                                            <div className="property-meta">
                                                <div>
                                                    <FaBed />
                                                    <span>{property.property_details.bedrooms}</span>
                                                </div>

                                                <div>
                                                    <FaBath />
                                                    <span>{property.property_details.bathrooms}</span>
                                                </div>

                                                <div>
                                                    <FaRulerCombined />
                                                    <span>{property.property_details.area_sqft} sqft</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Link>

                            ))}
                        </div>
                }

            </div>
        </section>
    );
}

export default SavedProperties;
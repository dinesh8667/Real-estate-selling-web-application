import React, { useEffect, useState } from "react";
import { FaImages } from "react-icons/fa";
import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaRulerCombined,
    FaCheckCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from "react-router-dom";
import axios from 'axios'
import "./style.scss"

const PropertyDetails = ({ message, setMessage }) => {
    const token = localStorage.getItem('accessToken');
    const user_id = localStorage.getItem('user_id')
    const { id } = useParams()
    const [data, setData] = useState([])
    const [isopen, setIsopen] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(()=>{
        console.log(data);
    },[data])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Property Details
                const propertyRes = await axios.get(
                    `http://127.0.0.1:8000/api/properties/${id}`
                );
                setData(propertyRes.data);
                const savedRes = await axios.get(
                    "http://127.0.0.1:8000/api/saved-properties/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const isPropertySaved = savedRes.data.some(
                    (item) => item.property === propertyRes.data.id
                );
                setIsSaved(isPropertySaved);
            } catch (error) {
                console.error(error);
            }
        };
        if (token) {
            fetchData();
        }
    }, [id, token]);

    const handleToggleSave = async (id) => {
        if (isLoading) return;
        setIsLoading(true);
        try {

            if (!token) {
                alert("Please log in to save properties!");
                setIsLoading(false);
                return;
            }

            const response = await axios.post(
                'http://127.0.0.1:8000/api/saved-properties/',
                {
                    property: id // Django expects this exact key!
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setIsSaved(response.data.is_saved);
            console.log(response.data.message);

        } catch (error) {
            console.error("Failed to toggle save:", error);
        } finally {
            setIsLoading(false);
        }
    };

    function handleOpen() {
        setIsopen(prev => !prev)
        setCurrentImage(0)
    }

    function handleNext(params) {
        setCurrentImage(currentImage + 1)
    }
    function handleprev(params) {
        setCurrentImage(currentImage - 1)
    }

    function handleChange(e) {
        setMessage({ ...message, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        navigate(`/chat/${id}/${data?.seller_details?.user}/${user_id}`)
    }

    return (
        <section className="property-details-page">
            {
                isopen &&
                <div className="image-viwer-container">
                    <button onClick={handleprev} disabled={currentImage == 0}><i className="bi bi-caret-left"></i></button>
                    <div><img src={data.gallery_images?.[currentImage]} alt="" /></div>
                    <button onClick={handleNext} disabled={currentImage == data.gallery_images?.length - 1}><i className="bi bi-caret-right"></i></button>
                    <button onClick={handleOpen}><i className="bi bi-x close-icon"></i></button>
                </div>

            }
            <div className="property-container">
                <div className="property-left">
                    <div className="gallery">
                        <div className="main-image">
                            {/* <span className="tag">For Sale</span>
                            <span className="tag secondary">New Construction</span> */}
                            {
                                isSaved ? <i className="bi bi-suit-heart-fill saved" onClick={() => handleToggleSave(data.id)}></i> :
                                    <i className="bi bi-suit-heart" onClick={() => handleToggleSave(data.id)}></i>
                            }


                            <img src={data.main_image} alt="" />
                        </div>

                        <div className="side-images">

                            {data.gallery_images?.[0] && (
                                <div className="side-image">
                                    <img src={data.gallery_images?.[0]} alt="" />
                                </div>
                            )}

                            {data.gallery_images?.[1] && (
                                <div className="side-image">
                                    <img src={data.gallery_images?.[1]} alt="" />

                                    {data.gallery_images?.length > 3 && (
                                        <div className="more-images-overlay" onClick={handleOpen}>
                                            <FaImages />

                                            <h3>+{data.gallery_images?.length - 1}</h3>

                                            <p>More Photos</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Property Info */}
                    <div className="property-info">
                        <div className="property-info-left">
                            <h1>{data.title} ({data.property_type_name})</h1>
                            
                            <div className="location">
                                <FaMapMarkerAlt />
                                <span>{data.address}, {data.city}</span>
                            </div>
                            <span className="price-tag">₹ {data.price}</span>
                            {
                                data.status === "Sold" && <span className="sold-tag">Sold</span>
                            }
                            <div className="stats">
                                <div>
                                    <strong>{data.bedrooms}</strong>
                                    <span>Beds</span>
                                </div>
                                <div>
                                    <strong>{data.bathrooms}</strong>
                                    <span>Baths</span>
                                </div>
                                <div>
                                    <strong>{data.area_sqft}</strong>
                                    <span>Sq ft</span>
                                </div>
                            </div>
                            <hr />
                            <div className="about">
                                <h3>About This Property</h3>
                                <p>{data.description}</p>
                            </div>
                            <div className="amenities">
                                <h3>Premium Amenities</h3>
                                <div className="amenity-grid">
                                    <div><FaCheckCircle /> Infinity Edge Pool</div>
                                    <div><FaCheckCircle /> Smart Home Automation</div>
                                    <div><FaCheckCircle /> Private Elevator Access</div>
                                    <div><FaCheckCircle /> Wine Cellar</div>
                                    <div><FaCheckCircle /> Home Cinema Room</div>
                                    <div><FaCheckCircle /> Biometric Security System</div>
                                </div>
                            </div>
                        </div>

                        <div className="property-info-right">
                            <div className="contact-card">
                                <h3>Contact Agent</h3>
                                <div className="agent">
                                    <i className="bi bi-person-check"></i>
                                    <div>
                                        <h4>{data.seller_details?.user_name}</h4>
                                        <p>Agency: {data.seller_details?.agency_name}</p>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" placeholder="Your Name" name="name" onChange={handleChange} required />
                                    <input type="email" placeholder="Email Address" name="email" onChange={handleChange} required />
                                    <input type="tel" placeholder="Phone Number" name="phone_number" onChange={handleChange} required />
                                    <textarea
                                        rows="5"
                                        placeholder="I am interested in this property..."
                                        name="message" onChange={handleChange}
                                        required
                                    />
                                    <button type="submit" className="request-btn">
                                        Request Details →
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyDetails;
import React from "react";
import { FaImages } from "react-icons/fa";
import "./style.css";

import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaRulerCombined,
    FaCheckCircle,
} from "react-icons/fa";

const PropertyDetails = () => {
    const images = [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    ];

    return (
        <section className="property-details-page">
            <div className="property-container">

                {/* LEFT SIDE */}
                <div className="property-left">

                    {/* Gallery */}
                    <div className="gallery">
                        <div className="main-image">
                            <span className="tag">For Sale</span>
                            <span className="tag secondary">New Construction</span>

                            <img src={images[0]} alt="" />
                        </div>

                        <div className="side-images">

                            {images[1] && (
                                <div className="side-image">
                                    <img src={images[1]} alt="" />
                                </div>
                            )}

                            {images[2] && (
                                <div className="side-image">
                                    <img src={images[2]} alt="" />

                                    {images.length > 3 && (
                                        <div className="more-images-overlay">
                                            <FaImages />

                                            <h3>+{images.length - 3}</h3>

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
                            <h1>The Obsidian Penthouse</h1>
                            <div className="location">
                                <FaMapMarkerAlt />
                                <span>1044 Skyline Boulevard, Metropolis</span>
                            </div>
                            <h2>$12,500,000</h2>
                            <div className="stats">
                                <div>
                                    <strong>4</strong>
                                    <span>Beds</span>
                                </div>
                                <div>
                                    <strong>5.5</strong>
                                    <span>Baths</span>
                                </div>
                                <div>
                                    <strong>6,200</strong>
                                    <span>Sq ft</span>
                                </div>
                            </div>
                            <hr />
                            <div className="about">
                                <h3>About This Property</h3>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem necessitatibus illo aperiam minus ipsam commodi itaque temporibus nisi error, expedita, nesciunt omnis possimus? Dolor incidunt, delectus ullam voluptates quod illo. Quo cupiditate hic perferendis consequuntur accusamus corporis quia amet fugit officia dolorem nostrum nam doloremque numquam delectus est porro, distinctio dicta dolores nesciunt laudantium magnam! Expedita nobis repellendus, suscipit dolorem inventore dolore ducimus quasi autem fugiat sit incidunt accusantium magni vero tempora nemo! Eos dolorem assumenda placeat ipsum, aliquam nihil officia fugiat omnis enim, sapiente sunt praesentium dolorum modi aperiam illum, aspernatur vel amet? Reiciendis in aperiam eligendi velit tenetur.</p>
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
                                    <img
                                        src="https://randomuser.me/api/portraits/women/44.jpg"
                                        alt=""
                                    />
                                    <div>
                                        <h4>Elena Rostova</h4>
                                        <p>Senior Luxury Broker</p>
                                    </div>
                                </div>
                                <form>
                                    <input type="text" placeholder="Your Name" />
                                    <input type="email" placeholder="Email Address" />
                                    <input type="tel" placeholder="Phone Number" />
                                    <textarea
                                        rows="5"
                                        placeholder="I am interested in this property..."
                                    />
                                    <button type="submit">
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
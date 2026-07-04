import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import {
    FaMapMarkerAlt,
    FaSearch,
    FaHome,
    FaBuilding,
    FaCity,
    FaTractor,
    FaUmbrellaBeach,
    FaStore,
    FaBed,
    FaBath,
    FaRulerCombined,
} from "react-icons/fa";
import "./style.scss";

const categories = [
    {
        icon: <FaHome />,
        title: "Luxury Villas",
        desc: "Exquisite private retreats with unparalleled elegance.",
    },
    {
        icon: <FaBuilding />,
        title: "Apartments",
        desc: "Modern high-rise living in the heart of the city.",
    },
    {
        icon: <FaCity />,
        title: "Townhouses",
        desc: "Sophisticated urban living with classic charm.",
    },
    {
        icon: <FaTractor />,
        title: "Farmhouses",
        desc: "Serene rural escapes with high-end amenities.",
    },
    {
        icon: <FaUmbrellaBeach />,
        title: "Beach Houses",
        desc: "Breathtaking ocean views and coastal luxury.",
    },
    {
        icon: <FaStore />,
        title: "Commercial Spaces",
        desc: "Prestigious addresses for visionary businesses.",
    },
];

function Index({ setSearch, search }) {
    const [properties, setProperties] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [price, setPrice] = useState([])
    useEffect(() => {
        const fetchPublicProperties = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/properties/");
                const activeProperties = response.data.filter(prop => prop.status === 'Active');
                setProperties(activeProperties);
                const unavailablePrices = activeProperties
                    .filter(item => !price.includes(item.price))
                    .map(item => item.price);

                setPrice(unavailablePrices);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching properties:", error);
                setIsLoading(false);
            }
        };

        fetchPublicProperties();
    }, []);

    const formatPrice = (priceStr) => {
        const price = parseFloat(priceStr);
        if (price >= 1000000) {
            return `₹${(price / 1000000).toFixed(1)}M`;
        }
        return `$${price.toLocaleString()}`;
    };

    return (
        <div className="home">
            {/* HERO */}
            <section className="hero">
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1>Find your Next Masterpiece</h1>

                    <p>
                        Discover exclusive properties curated for the modern visionary.
                    </p>

                    <div className="search-bar">
                        <div className="search-item">
                            <FaMapMarkerAlt />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location, Neighborhood, or City"
                                onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })}
                            />
                        </div>

                        <div className="divider"></div>

                        <div className="search-item">
                            <span>₹</span>
                            <select name="price" onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })}>
                                <option value="">Select Budget</option>
                                {
                                    price.map((item, index) => {
                                        return (
                                            <option value={item}>&lt; {item}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <Link to={'/browse'}>
                            <button>
                                <FaSearch />
                                Search
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="categories">
                <div className="section-heading">
                    <h2>Browse by Category</h2>
                    <p>Explore luxury properties tailored to your lifestyle.</p>
                    <div className="underline"></div>
                </div>

                <div className="category-grid">
                    {categories.map((item, index) => (
                        <div className="category-card" key={index}>
                            <div className="icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CURATED COLLECTION */}
            <section className="collection">
                <div className="collection-title">
                    <h2>Curated Collection</h2>
                    <div className="underline"></div>
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        Loading exclusive collections...
                    </div>
                ) : (
                    <div className="property-grid">
                        {properties.length === 0 ? (
                            <div className="empty-state">
                                No active properties currently listed.
                            </div>
                        ) : (
                            properties.map((property) => (
                                <Link to={`/property/${property.id}`} key={property.id}>
                                    <div className="property-card">
                                        <div>
                                            <img
                                                className="property-img"
                                                src={property.main_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"}
                                                alt={property.title}
                                            />
                                        </div>

                                        <div className="property-content">
                                            <div className="property-header">
                                                <h3 className="property-title">
                                                    {property.title}
                                                </h3>
                                                <span className="price">{formatPrice(property.price)}</span>
                                            </div>

                                            <div className="location">
                                                <FaMapMarkerAlt />
                                                <span>{property.city}</span>
                                            </div>

                                            <div className="divider-line"></div>

                                            <div className="property-info">
                                                <div className="info-item">
                                                    <FaBed />
                                                    <span>{property.bedrooms}</span>
                                                </div>

                                                <div className="info-item">
                                                    <FaBath />
                                                    <span>{property.bathrooms}</span>
                                                </div>

                                                <div className="info-item">
                                                    <FaRulerCombined />
                                                    <span>{property.area_sqft} sqft</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Index;
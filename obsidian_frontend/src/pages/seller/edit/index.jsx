import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './style.scss';

const Index = () => {
  const base_url = "http://127.0.0.1:8000/api";
  const { id } = useParams(); // Grabs the property ID from your URL!
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // To show a loading state while getting data
  const [error, setError] = useState('');
  const token = localStorage.getItem('accessToken');
  
  const [propertyTypes, setPropertyTypes] = useState([]); 
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    address: '',
    city: '',
    status: 'Active'
  });

  // 1. Fetch Property Types AND the Existing Property Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch types for the dropdown
        const typesRes = await axios.get(`${base_url}/property-types/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPropertyTypes(typesRes.data);

        // Fetch the specific property details to fill the form!
        const propertyRes = await axios.get(`${base_url}/properties/${id}/`);
        const p = propertyRes.data;

        // Auto-fill the state with the real database values
        setFormData({
          title: p.title || '',
          description: p.description || '',
          property_type: p.property_type || (typesRes.data.length > 0 ? typesRes.data[0].id : ''),
          price: p.price || '',
          bedrooms: p.bedrooms || '',
          bathrooms: p.bathrooms || '',
          area_sqft: p.area_sqft || '',
          address: p.address || '',
          city: p.city || '',
          status: p.status || 'Active'
        });

      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load property data. It may have been deleted.");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchData();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Handle the PATCH request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Because we aren't sending image files here, we can just send the clean JSON object!
      await axios.patch(`${base_url}/properties/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
          // No need for multipart/form-data here since it's just text updates
        }
      });

      navigate('/dashboard');
    } catch (err) {
      console.error("Django rejected the update:", err.response?.data);
      setError('Failed to update listing. Please check your inputs.');
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="add-property-page pb-24"><div className="text-center text-white mt-20">Loading property details...</div></div>;
  }

  return (
    <div className="add-property-page pb-24">
      <div className="add-property-container relative overflow-hidden">
        
        <div className="page-header">
          <Link to="/dashboard" className="back-btn">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1>Edit Listing</h1>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          
          <div className="full-width form-group">
            <label>Property Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-control" />
          </div>

          <div className="form-group">
             <label>Property Type</label>
             <select name="property_type" value={formData.property_type} onChange={handleChange} required className="form-control">
               <option value="" disabled>Select Type...</option>
               {propertyTypes.map(type => (
                 <option key={type.id} value={type.id}>{type.name}</option>
               ))}
             </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-control">
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div className="full-width form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="form-control" />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="form-control" />
          </div>

          <div className="form-group">
            <label>Total Area (sqft)</label>
            <input type="number" name="area_sqft" value={formData.area_sqft} onChange={handleChange} required min="0" className="form-control" />
          </div>

          <div className="form-group">
            <label>Bedrooms</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0" className="form-control" />
          </div>
          
          <div className="form-group">
            <label>Bathrooms</label>
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="0" step="0.5" className="form-control" />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="form-control" />
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required className="form-control" />
          </div>

          <div className="full-width submit-section">
            <button type="submit" disabled={isLoading} className="publish-btn">
              {isLoading ? "Saving Updates..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
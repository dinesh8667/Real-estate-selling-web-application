import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './style.css'

const AddProperty = () => {
  const base_url = "http://127.0.0.1:8000/api"
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('accessToken')
  
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0); // Tracks which image is the thumbnail
  const [propertyTypes, setPropertyTypes] = useState([]); // Holds the types from Django
  
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

  // Fetch Property Types on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get(`${base_url}/property-types/`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setPropertyTypes(res.data);
        
        if (res.data.length > 0) {
          // Default to the first type so the field isn't blank
          setFormData(prev => ({ ...prev, property_type: res.data[0].id }));
        }
      } catch (err) {
        console.error("Failed to load property types", err);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
    setMainImageIndex(0); // Reset thumbnail selection to the first image when new files are uploaded
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      images.forEach(image => {
        submitData.append('images', image);
      });

      // Pass the selected thumbnail index to Django!
      submitData.append('main_image_index', mainImageIndex);

      await axios.post(`${base_url}/properties/`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard');
    } catch (err) {
      console.error("Django rejected it because:", err.response?.data);
      setError('Failed to create listing. Please check your inputs.');
      setIsLoading(false);
    }
  };

  return (
    <div className="add-property-page pb-24">
      <div className="add-property-container relative overflow-hidden">
        
        <div className="page-header">
          <Link to="/dashboard" className="back-btn">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1>Create New Listing</h1>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          
          <div className="full-width p-6 bg-[#0a0a0a] border border-dashed border-white/20 rounded-xl">
            <label className="block text-sm font-medium text-gray-400 mb-4">Property Images (Select Multiple)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#892cdc] file:text-white hover:file:bg-[#BC6FF1] transition-all cursor-pointer" 
            />
            
            {/* THUMBNAIL SELECTOR UI */}
            {images.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">Click an image to set it as the Cover Thumbnail:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((file, index) => (
                    <div 
                      key={index} 
                      onClick={() => setMainImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${mainImageIndex === index ? 'border-[#892cdc] scale-105 shadow-[0_0_15px_rgba(137,44,220,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-24 object-cover" />
                      {mainImageIndex === index && (
                        <div className="absolute top-0 right-0 bg-[#892cdc] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                          COVER
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
              {isLoading ? "Uploading Files & Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
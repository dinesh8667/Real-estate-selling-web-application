import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AddProperty = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // NEW: State to hold our raw physical image files
  const [images, setImages] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    address: '',
    city: '',
    status: 'Active'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NEW: Handle multiple file selections
  const handleImageChange = (e) => {
    // Convert the FileList object into a standard array and save it to state
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      
      // CRITICAL: We cannot use JSON anymore. We must build a FormData package.
      const submitData = new FormData();
      
      // 1. Append all the text fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // 2. Append all the image files under the name 'images'
      images.forEach(image => {
        submitData.append('images', image);
      });

      // 3. Shoot it to Django. Axios automatically sets the multipart/form-data headers!
      await axios.post('http://127.0.0.1:8000/api/properties/', submitData, {
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
    <div className="min-h-screen bg-[#000000] p-8 flex justify-center items-start pt-12 pb-24">
      <div className="w-full max-w-3xl bg-[#111827] border border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-[#ddb8ff] transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create New Listing</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* NEW: Multi-Image Uploader */}
            <div className="md:col-span-2 p-6 bg-[#0e0e0e] border border-dashed border-white/20 rounded-xl">
              <label className="block text-sm font-medium text-gray-400 mb-4">Property Images (Select Multiple)</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#892cdc] file:text-white hover:file:bg-[#BC6FF1] transition-all cursor-pointer" 
              />
              <p className="mt-3 text-xs text-gray-500">
                {images.length > 0 ? `${images.length} files selected.` : "Hold Ctrl (Windows) or Cmd (Mac) to select multiple photos. The first photo becomes the cover."}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Property Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01"
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all">
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0"
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="0" step="0.5"
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Total Area (sqft)</label>
              <input type="number" name="area_sqft" value={formData.area_sqft} onChange={handleChange} required min="0"
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-[#892cdc] focus:outline-none transition-all" />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-8">
            <button type="submit" disabled={isLoading}
              className="w-full bg-[#892cdc] hover:bg-[#BC6FF1] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(137,44,220,0.3)] disabled:opacity-50">
              {isLoading ? "Uploading Files & Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
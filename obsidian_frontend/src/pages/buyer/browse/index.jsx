import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import "./style.scss";

function Listings({ setSearch, search }) {
  const [data, setData] = useState([])
  const [searchData, setSearchData] = useState([])
  const [filterTags, setFilterTags] = useState([])
  const [price, setPrice] = useState([])
  const [sortBy, setSortBy] = useState(0)
  const token = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchPublicProperties = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/properties/");
        const activeProperties = response.data.filter(prop => prop.status === 'Active');
        setData(activeProperties);
        const unavailablePrices = activeProperties
          .filter(item => !price.includes(item.price))
          .map(item => item.price);

        setPrice(unavailablePrices);

        // setIsLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        // setIsLoading(false);
      }
    };

    fetchPublicProperties();
  }, [token])

  useEffect(() => {
    const temp = data.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(search.location.toLowerCase()) || item.city.toLowerCase().includes(search.location.toLowerCase()) || item.description.toLowerCase().includes(search.location.toLowerCase())
      const matchPrice = !search.price || Number(item.price) <= Number(search.price);
      const matchTag =filterTags.length === 0 || filterTags.includes(item.property_type_name.toLowerCase())
      return matchSearch && matchPrice && matchTag
    })

    const hasFilters = search.location != '' || filterTags.length > 0 || search.price != ''

    if (!hasFilters) {
      if (sortBy == 0) {
        setSearchData(data)
      } else if (sortBy == 1) {
        const sortedData = [...data].sort((a, b) => a.price - b.price)
        setSearchData(sortedData)
      } else if (sortBy == 2) {
        const sortedData = [...data].sort((a, b) => b.price - a.price)
        setSearchData(sortedData)
      }
    } else {
      if (sortBy == 0) {
        setSearchData(temp)
      } else if (sortBy == 1) {
        const sortedData = [...temp].sort((a, b) => a.price - b.price)
        setSearchData(sortedData)
      } else if (sortBy == 2) {
        const sortedData = [...temp].sort((a, b) => b.price - a.price)
        setSearchData(sortedData)
      }
    }
  }, [data, search, filterTags, sortBy])

  function handleTag(e) {
    const tag = e.target.value
    if (e.target.checked) {
      setFilterTags(prev => [...prev, tag])
    } else {
      setFilterTags(prev => prev.filter((item) => item !== tag))
    }
  }

  // useEffect(() => {
  //   console.log(sortBy);
  // }, [sortBy])

  return (
    <div className="listings-page">
      {/* Sidebar */}

      <aside className="filters">
        <div className="filter-header">
          <h2>Filters</h2>
          <button>Reset All</button>
        </div>

        <div className="filter-section">
          <h4>Search Property</h4>

          <input
            type="text"
            placeholder="Search..."
            name="location"
            value={search.location}
            onChange={(e) => setSearch({...search, [e.target.name]:e.target.value})}
          />
        </div>

        <div className="search-price">
          <span>₹</span>
          <select name="price" onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })}>
            <option value=''>Select Budget</option>
            {/* {
              search?.price > 0 && <option value={search.price} selected>&lt; {search?.price}</option>
            } */}
            {
              price.map((item, index) => {
                {
                  return (
                    <option key={item} value={item}>&lt; {item}</option>
                    // search.price != item && <option key={item} value={item}>&lt; {item}</option>
                  )
                }
              })
            }
          </select>
        </div>

        <div className="filter-section">
          <h4>Property Type</h4>

          <label>
            <input type="checkbox" value={"penthouse"} onChange={handleTag} /> Penthouse
          </label>

          <label>
            <input type="checkbox" value={"villa"} onChange={handleTag} /> Villa
          </label>

          <label>
            <input type="checkbox" value={"estate"} onChange={handleTag} /> Estate
          </label>

          <label>
            <input type="checkbox" value={"mansions"} onChange={handleTag} /> Mansions
          </label>

          <label>
            <input type="checkbox" value={"sky villa"} onChange={handleTag} /> Sky Villa
          </label>

          <label>
            <input type="checkbox" value={"condominiums"} onChange={handleTag} /> Condominiums
          </label>
        </div>
      </aside>

      {/* Content */}

      <main className="listing-content">
        <div className="top-section">
          <div>
            <h1>Exclusive Listings</h1>
            <p>
              Showing {searchData.length} properties matching
              your criteria
            </p>
          </div>

          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value={'0'}>Featured</option>
            <option value={'1'}>Price Low-High</option>
            <option value={'2'}>Price High-Low</option>
          </select>
        </div>

        <div className="divider"></div>

        <div className="cards-grid">
          {searchData.map((item) => (
            <Link to={`/property/${item.id}`} key={item.id}>
              <div
                className="property-card">
                <div className="image-wrapper">
                  {item.badge && (
                    <span className="badge">
                      {item.badge}
                    </span>
                  )}

                  <img
                    src={item.main_image}
                    alt={item.title}
                  />
                </div>

                <div className="card-content">
                  <h2>{item.title} <span>({item.property_type_name})</span></h2>

                  <h3>₹ {item.price}</h3>

                  <p>{item.address},</p>
                  <p>{item.city}</p>

                  <div className="tags">
                    <span>{item.bedrooms} Beds</span>
                    <span>{item.bathrooms} Baths</span>
                    <span>{item.area_sqft} sqft</span>
                    {/* {item.tags.map(
                    (tag, index) => (
                      <span key={index}>
                        {tag}
                      </span>
                    )
                  )} */}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="pagination">
          <button>{"<"}</button>
          <button className="active">
            1
          </button>
          <button>{">"}</button>
        </div>
      </main>
    </div>
  );
}

export default Listings;
import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "all",
    sortByPrice: "",
    location: "",
    maxPrice: 50000,
  });

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      const { type, sortByPrice, location, maxPrice } = filters;
      const queryParams = new URLSearchParams();

      if (type !== "all") queryParams.append("type", type);
      if (location) queryParams.append("location", location);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (sortByPrice) queryParams.append("sortByPrice", sortByPrice);

      const response = await axios.get(
        `${config.api}/list?${queryParams.toString()}`
      );

      setListings(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch listings");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  return (
    <div className="container mx-auto md:px-12 py-10 min-h-screen mt-10 flex flex-col md:flex-row gap-6">
      
      {/* ====== Buttons: Show Filters & Show Bookings ====== */}
      <div className="w-full md:w-1/4">
        {/* Mobile View - Buttons Side by Side */}
        <div className="flex md:hidden justify-between px-4 mb-4 gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "Close Filters" : "Show Filters"}
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md w-full" onClick={() => navigate('/bookings')} >
            Show Bookings
          </button>
        </div>

        {/* Desktop View - Buttons Stacked */}
        <div className="hidden md:flex md:flex-col md:gap-4">
          {/* Show Filters Button */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "Close Filters" : "Show Filters"}
          </button>

          {/* Show Bookings Button (Directly Under Show Filters) */}
          <button className="bg-green-600 text-white px-4 py-2 rounded-md w-full"   onClick={() => navigate('/bookings')}>
            Show Bookings
          </button>
        </div>

        {/* Dropdown Filters (visible when showFilter is true) */}
        {showFilter && (
          <div
            ref={filterRef}
            className="absolute md:relative top-12 left-0 bg-white p-4 rounded-lg shadow-md w-64 md:w-full z-50 mt-2"
          >
            <h3 className="text-lg font-bold mb-4">Filters</h3>

            {/* Type Filter */}
            <label className="block mb-1 font-semibold">Type</label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            >
              <option value="all">All</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurant">Restaurant</option>
            </select>

            {/* Sort by Price */}
            <label className="block mb-1 font-semibold">Sort by Price</label>
            <select
              value={filters.sortByPrice}
              onChange={(e) =>
                setFilters({ ...filters, sortByPrice: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">None</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>

            {/* Price Range */}
            <label className="block mb-1 font-semibold">
              Max Price: {filters.maxPrice} INR
            </label>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="w-full mb-4"
            />

            {/* Location */}
            <label className="block mb-1 font-semibold">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              placeholder="Enter location"
              className="w-full p-2 border rounded mb-4"
            />

            {/* Apply Filters Button */}
            <button
              className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
              onClick={fetchListings}
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>

      {/* ====== Listings Section ====== */}
      <div className="w-full md:w-3/4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 md:gap-6">
          {listings.length > 0 ? (
            listings
              .filter((listing) => listing.isActive) // Show only active listings
              .map((listing) => (
                <div className="md:p-4" key={listing._id}>
                  <Card hotel={listing} />
                </div>
              ))
          ) : (
            <p className="text-center w-full">No listings found.</p>
          )}
        </div>
        
        )}
      </div>
    </div>
  );
}

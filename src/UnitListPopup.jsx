import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
export default function UnitListPopup({ hotel, onClose }) {
  const [unitType, setUnitType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availableUnits, setAvailableUnits] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const hotelTypes = ["Single Room", "Double Room", "Suite", "Deluxe Room", "Family Room", "VIP Room"];
  const restaurantTypes = ["Standard Table", "Booth", "Outdoor Table", "VIP Table", "Private Dining"];
  const availableFeatures = ["AC", "WiFi", "Parking", "TV", "Mini Bar"];

  useEffect(() => {
    if (hotel) {
      setUnitType("");
      setCapacity("");
      setAvailableUnits("");
      setPrice("");
      setFeatures([]);
    }
  }, [hotel]);

  const handleOverlayClick = (e) => {
    if (e.target.id === "popup-overlay") onClose();
  };

  const validateAndSubmit = async (e) => {
    e.preventDefault();

    const cap = parseInt(capacity, 10);
    const avail = parseInt(availableUnits, 10);
    const roomPrice = parseFloat(price);

    // Get authentication details from localStorage
    const accessToken = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("role");

    if (!accessToken || !userRole) {
      showNotification("Authentication required. Please log in.", "error");
      return;
    }

    if (userRole !== "vendor") {
      showNotification("Unauthorized! Only vendors can add units.", "error");
      return;
    }

    if (!unitType || isNaN(cap) || isNaN(avail) || isNaN(roomPrice)) {
      showNotification("Please fill in all fields!", "error");
      return;
    }

    if (cap < 1 || avail < 0 || roomPrice < 0) {
      showNotification("Invalid values. Capacity must be at least 1.", "error");
      return;
    }

    if (avail > cap) {
      showNotification("Available units cannot exceed total capacity!", "error");
      return;
    }
   console.log(hotel);
   
    if (!hotel || !hotel._id || !hotel.vendorID || !hotel.isActive) {
      showNotification("Only active listings can add units!", "error");
      return;
    }

    const unitData = {
      list: hotel._id,
      vendor: hotel.vendor,
      type: unitType,
      capacity: cap,
      price: roomPrice,
      features: features.join(", "),
      availability: {
        count: avail,
        isAvailable: avail > 0,
        availableFrom: new Date().toISOString(),
      },
    };

    try {
      const response = await axios.post(`${config.api}/unit`, unitData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Send token in headers
        },
      });

      if (response.status === 201) {
        showNotification("Successfully listed!", "success");
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to add unit.", "error");
    }
  };

  const handleFeatureSelection = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 1500);
  };

  return (
    <div
      id="popup-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg w-80 max-w-full">
        <h6 className="text-sm font-bold mb-2">
          {hotel?.name ? `List Unit for ${hotel.name}` : "Add Unit"}
        </h6>

        {/* Unit Type Selection */}
        <label className="block text-gray-700 font-medium mb-1">Unit Type</label>
        <select
          value={unitType}
          onChange={(e) => setUnitType(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Select Type</option>
          {hotel?.type === "Hotel" && (
            <optgroup label="Hotel Rooms">
              {hotelTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </optgroup>
          )}
          {hotel?.type === "Restaurant" && (
            <optgroup label="Restaurant Tables">
              {restaurantTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </optgroup>
          )}
        </select>

        {/* Capacity Input */}
        <label className="block text-gray-700 font-medium mt-3 mb-1">Total Capacity</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Enter total capacity"
          min="1"
        />

        {/* Available Units */}
        <label className="block text-gray-700 font-medium mt-3 mb-1">Available Units</label>
        <input
          type="number"
          value={availableUnits}
          onChange={(e) => setAvailableUnits(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Enter available units"
          min="0"
        />

        {/* Price Input */}
        <label className="block text-gray-700 font-medium mt-3 mb-1">Price (INR)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Enter price"
          min="0"
        />

        {/* Features Selection */}
        <label className="block text-gray-700 font-medium mt-3 mb-1">Features</label>
        <div className="flex flex-wrap gap-2">
          {availableFeatures.map((feature) => (
            <button
              key={feature}
              type="button"
              className={`px-3 py-1 rounded-lg text-sm ${features.includes(feature) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
              onClick={() => handleFeatureSelection(feature)}
            >
              {feature}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={validateAndSubmit}>
            List Now
          </button>
        </div>

        {/* Notification Message */}
        {notification.message && (
          <div className={`mt-4 p-2 text-white text-center rounded-lg ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
}

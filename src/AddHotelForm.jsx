import React, { useState } from "react";
import config from "../config";

export default function AddHotelForm({ onClose }) {
  const predefinedFeatures = ["WiFi", "Pool", "Parking", "Gym", "Spa"];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    pricing: "",
    facilities: [],
    newFeatures: "",
    images: [],
    type:"",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (feature) => {
    setFormData((prevState) => ({
      ...prevState,
      facilities: prevState.facilities.includes(feature)
        ? prevState.facilities.filter((f) => f !== feature)
        : [...prevState.facilities, feature],
    }));
  };

  const handleAddFeatures = () => {
    const featuresToAdd = formData.newFeatures
      .split(",")
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "" && !formData.facilities.includes(feature));

    if (featuresToAdd.length > 0) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, ...featuresToAdd],
        newFeatures: "",
      });
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((f) => f !== feature),
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userRole = localStorage.getItem("role");

    if (!accessToken || !refreshToken) {
      alert("You must be logged in to add a hotel.");
      return;
    }

    if (userRole !== "vendor") {
      alert("Only vendors can add listings.");
      return;
    }

    const fetchWithAuth = async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("type", "Hotel");
        formDataToSend.append("description", formData.description);
        formDataToSend.append("pricing", formData.pricing);
        formDataToSend.append("facilities", JSON.stringify(formData.facilities));

        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });

        let response = await fetch(`${config.api}/list`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDataToSend,
        });

        if (response.status === 401) {
          const refreshResponse = await fetch(`${config.api}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          const refreshData = await refreshResponse.json();

          if (refreshResponse.ok) {
            accessToken = refreshData.accessToken;
            localStorage.setItem("accessToken", accessToken);

            response = await fetch(`${config.api}/list`, {
              method: "POST",
              headers: { Authorization: `Bearer ${accessToken}` },
              body: formDataToSend,
            });
          } else {
            alert("Session expired. Please log in again.");
            return;
          }
        }

        const result = await response.json();

        if (response.ok) {
          alert("Hotel added successfully!");
          onClose();
        } else {
          alert(result.error || "Failed to add hotel.");
        }
      } catch (error) {
        alert("Something went wrong!");
        console.error("Error:", error);
      }
    };

    fetchWithAuth();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-3 bg-white rounded-md shadow-md w-80">
      <h2 className="text-lg font-semibold">Add Hotel</h2>
      <input type="text" name="name" placeholder="Hotel Name" className="border p-1 text-sm rounded" onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" className="border p-1 text-sm rounded" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" className="border p-1 text-sm rounded h-16" onChange={handleChange}></textarea>
      
      <input type="number" name="pricing" placeholder="Base Price" className="border p-1 text-sm rounded" onChange={handleChange} required />

      <div className="border p-1 rounded">
        <h3 className="text-sm font-medium">Select Key Features</h3>
        <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
          {predefinedFeatures.map((feature) => (
            <label key={feature} className="flex items-center gap-1">
              <input type="checkbox" checked={formData.facilities.includes(feature)} onChange={() => handleCheckboxChange(feature)} />
              {feature}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-1">
        <input type="text" name="newFeatures" placeholder="Add custom features" className="border p-1 text-xs rounded flex-grow" value={formData.newFeatures} onChange={handleChange} />
        <button type="button" className="bg-blue-500 text-white px-2 py-1 text-xs rounded" onClick={handleAddFeatures}>Add</button>
      </div>

      <div className="flex flex-wrap gap-1 text-xs">
        {formData.facilities.map((feature, index) => (
          <span key={index} className="bg-gray-300 px-1 py-0.5 rounded flex items-center">
            {feature}
            <button type="button" className="ml-1 text-red-500" onClick={() => handleRemoveFeature(feature)}>x</button>
          </span>
        ))}
      </div>

      <div className="border p-1 rounded">
        <input type="file" multiple accept="image/*" className="text-xs mt-1" onChange={handleImageUpload} />
        <div className="flex flex-wrap gap-1 mt-1">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-12 h-12 object-cover rounded" />
              <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1" onClick={() => handleRemoveImage(index)}>x</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <button type="button" className="bg-gray-500 text-white px-2 py-1 text-xs rounded" onClick={onClose}>Close</button>
        <button type="submit" className="bg-blue-600 text-white px-2 py-1 text-xs rounded">Submit</button>
      </div>
    </form>
  );
}

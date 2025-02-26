import React, { useState, useEffect } from "react";
import config from "../config";

export default function AddRestaurantForm({ onClose }) {
  const predefinedFeatures = ["WiFi", "Parking", "Outdoor Seating", "Live Music", "Home Delivery"];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    facilities: [],
    newFeatures: "",
    images: [],
    pricing: "", // Added pricing field
    type: "Restaurant", // Static type field
  });

  const [auth, setAuth] = useState({ accessToken: "", refreshToken: "", role: "" });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");
    setAuth({ accessToken, refreshToken, role });
  }, []);

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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("pricing", formData.pricing);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("facilities", JSON.stringify(formData.facilities));
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch(`${config.api}/list`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      console.log("Restaurant Data Submitted:", await response.json());
      onClose();
    } catch (error) {
      alert("Error submitting form: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-3 bg-white rounded-md shadow-md w-80">
      <h2 className="text-lg font-semibold">Add Restaurant</h2>
      <input type="text" name="name" placeholder="Restaurant Name" className="border p-1 text-sm rounded" onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" className="border p-1 text-sm rounded" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" className="border p-1 text-sm rounded h-16" onChange={handleChange}></textarea>
      <input type="text" name="pricing" placeholder="Pricing" className="border p-1 text-sm rounded" onChange={handleChange} required />

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

      <div className="border p-1 rounded">
        <input type="file" multiple accept="image/*" className="text-xs mt-1" onChange={handleImageUpload} name="images" />
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

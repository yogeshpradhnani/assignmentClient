import React, { useState } from "react";
import AddHotelForm from "./AddHotelForm";
import AddRestaurantForm from "./AddRestaurantForm";

export default function AddUnitPopup({ onClose }) {
  const [unitType, setUnitType] = useState(null);

  const handleSelect = (type) => {
    setUnitType(type);
  };

  return (
    <div
      id="popup-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={(e) => e.target.id === "popup-overlay" && onClose()}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full relative">
        {!unitType ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Select Unit Type</h2>
            <div className="flex flex-col gap-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleSelect("hotel")}
              >
                Add Hotel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => handleSelect("restaurant")}
              >
                Add Restaurant
              </button>
            </div>
          </>
        ) : unitType === "hotel" ? (
          <AddHotelForm onClose={onClose} />
        ) : (
          <AddRestaurantForm onClose={onClose} />
        )}
      </div>
    </div>
  );
}

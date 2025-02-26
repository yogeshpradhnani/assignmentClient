import React, { useState } from "react";
import HotelDetailPopup from "./HotelDetailPopup";
import hotelimg from "./assets/hotelimg.png";

export default function Card({ hotel }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleBookNow = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please log in or create an account to book.");
    } else {
      setSelectedHotel(hotel); // Pass the hotel data
      setIsPopupOpen(true);
    }
  };

  return (
    <div className="relative">
      <div className="card bg-white w-72 shadow-lg rounded-xl overflow-hidden">
        {/* Hotel Image */}
        <figure className="h-40 w-full">
          <img
            src={hotel.images?.[0] || hotelimg} // Default image fallback
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </figure>

        {/* Hotel Info */}
        <div className="card-body p-4 text-center">
          <h2 className="text-lg font-semibold">{hotel.name}</h2>
          <p className="text-sm text-gray-500">{hotel.type}</p>
          <p className="font-semibold text-lg">₹{hotel.pricing} INR</p>
          
          {/* Facilities Display */}
          <div className="flex flex-wrap justify-center gap-1 my-2">
            {hotel.facilities?.slice(0, 3).map((facility, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-200 rounded-md">
                {facility}
              </span>
            ))}
            {hotel.facilities?.length > 3 && <span className="text-xs text-gray-500">+ more</span>}
          </div>

          {/* Availability Status */}
          <p className={`text-sm ${hotel.isActive ? "text-green-600" : "text-red-500"}`}>
            {hotel.isActive ? "Available" : "Not Available"}
          </p>

          {/* Book Now Button */}
          <div className="card-actions mt-3">
            <button className="btn btn-primary w-full" onClick={handleBookNow}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Detail Popup */}
      {isPopupOpen && selectedHotel && (
        <HotelDetailPopup
          hotel={selectedHotel}
          listingId={selectedHotel._id}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
}

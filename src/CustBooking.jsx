import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function CustBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve authentication details from localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("You must be logged in to view bookings");
      navigate("/login"); // Redirect to login page if not authenticated
      return;
    }

    fetchBookings(accessToken);
  }, []);

  // Fetch customer bookings
  const fetchBookings = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.api}/book/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch bookings");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto md:px-12 py-10 min-h-screen mt-10 flex flex-col md:flex-row gap-6">
      
      {/* ===== Left Sidebar (Back Button for Desktop) ===== */}
      <div className="w-full md:w-1/4">
        <div className="hidden md:flex md:flex-col md:gap-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md w-full"
            onClick={() => navigate("/")}
          >
            Back to Listings
          </button>
        </div>
      </div>

      {/* ===== Mobile Back Button (Ensure it is visible) ===== */}
      <div className="block md:hidden px-4 mb-4">
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded-md w-full"
          onClick={() => navigate("/")}
        >
          ← Back to Listings
        </button>
      </div>

      {/* ===== Right Side: Show Bookings ===== */}
      <div className="w-full md:w-3/4">
        <h2 className="text-2xl font-bold mb-6">Customer Bookings</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="border p-4 rounded-lg shadow-md bg-white">
                <h3 className="text-lg font-bold">{booking.listingID?.name || "N/A"}</h3>
                <p className="text-gray-600">Type: {booking.unitID?.type || "Unknown"}</p>
                <p className="text-gray-600">Units Booked: {booking.noOdBookedUnit}</p>
           {booking.listingID.type!='Restaurant' && (
             <>
             <p className="text-gray-600">
               Check-in: {booking.bookingDates?.checkIn 
                 ? new Date(booking.bookingDates.checkIn).toLocaleDateString()
                 : "N/A"}
             </p>
             <p className="text-gray-600">
               Check-out: {booking.bookingDates?.checkOut 
                 ? new Date(booking.bookingDates.checkOut).toLocaleDateString()
                 : "N/A"}
             </p>
           </>
           )}
              
                <p className="text-gray-600 font-semibold">
                  Status: <span className="text-blue-500">{booking.status}</span>
                </p>
                <p className="text-gray-600">
                  Payment: <span className="text-green-500">{booking.paymentDetails.paymentStatus}</span> 
                  ({booking.paymentDetails.amount} INR)
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

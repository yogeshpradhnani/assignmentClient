import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Bookings() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);

  // Get accessToken and role from localStorage
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // Restrict access to only vendors
  useEffect(() => {
    if(role !== "vendor" && role !== "admin") {
      alert("Access denied! Only vendors can view this page.");
    }
  }, [role, navigate]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${config.api}/book`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings.");
        }

        const data = await response.json();
        console.log(data.data);
        
        setBookings(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [accessToken]);

  // Update Booking Status
  const updateBookingStatus = async (id, newStatus, newPaymentStatus) => {
    try {
      const response = await fetch(`${config.api}/book/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, paymentStatus: newPaymentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking.");
      }

      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) => (booking._id === id ? updatedBooking.data : booking))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Booking
  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${config.api}/book/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete booking.");
      }

      // Remove from UI
      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="flex min-h-screen">
      {/* ====== Left Sidebar ====== */}
      <div className="hidden md:block w-64 bg-white shadow-md p-4 mt-20">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li>
            <button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/bookings")}>
              Bookings
            </button>
          </li>
          <li>
  <button
    className="w-full text-left hover:text-blue-600 transition"
    onClick={() => navigate(role === "admin" ? "/admin" : "/vendor")}
  >
    Units
  </button>
</li>
          <li>
            <button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/reviews")}>
              Reviews
            </button>
          </li>
        </ul>
      </div>

      {/* ====== Main Content Area ====== */}
      <div className="flex-1 flex flex-col items-center mt-20">
        {/* ====== Bookings Section ====== */}
        <h2 className="text-2xl font-bold mb-4">All Bookings</h2>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back
        </button>

        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="w-full max-w-4xl">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Customer</th>
                  <th className="border border-gray-300 px-4 py-2">Check-In</th>
                  <th className="border border-gray-300 px-4 py-2">Check-Out</th>
            
                  <th className="border border-gray-300 px-4 py-2">Booked</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
    
                    
                    <td className="border border-gray-300 px-4 py-2">{booking.customerID.username}</td>
                    {booking.listingID.type!='Restaurant' && (
             <>
        <td className="border border-gray-300 px-4 py-2">
             {booking.bookingDates?.checkIn 
                 ? new Date(booking.bookingDates.checkIn).toLocaleDateString()
                 : "N/A"}
             </td>
             <td className="border border-gray-300 px-4 py-2">
                {booking.bookingDates?.checkOut 
                 ? new Date(booking.bookingDates.checkOut).toLocaleDateString()
                 : "N/A"}
             </td>
           </>
           )}
                    <td className="border border-gray-300 px-4 py-2">
                     {booking.noOdBookedUnit}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">₹{booking.paymentDetails.amount}</td>
                    
                    {/* Status Dropdown */}
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking._id, e.target.value, booking.paymentStatus)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Payment Status Dropdown */}
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        value={booking.paymentStatus}
                        onChange={(e) => updateBookingStatus(booking._id, booking.status, e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>

                    {/* Delete Button */}
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => deleteBooking(booking._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import PaymentGatewayPopup from "./PaymentGatewayPopup";
import config from "../config";

export default function HotelDetailPopup({ onClose, listingId }) {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [numItems, setNumItems] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listingType, setListingType] = useState("");

  useEffect(() => {
    const fetchUnitData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to view this.");
        onClose();
        return;
      }

      try {
        const response = await fetch(`${config.api}/unit/${listingId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        console.log(result.data);

        if (response.ok) {
          setUnits(result.data);
          setSelectedUnit(result.data[0]);
          setListingType(result.data[0]?.list?.type || "");
        } else {
          throw new Error(result.message || "Failed to fetch units");
        }
      } catch (error) {
        console.error("Error fetching unit data:", error);
        alert("Error fetching Hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [listingId, onClose]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (units.length === 0) {
    return <p className="text-center text-red-500">No units found.</p>;
  }

  const totalPrice = numItems * (selectedUnit?.price || 0);

  const handleConfirmBooking = async () => {
    if (listingType === "Hotel" && (!checkIn || !checkOut)) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to book.");
      return;
    }

    const bookingData = {
      listingID: listingId,
      unitID: selectedUnit?._id,
      checkIn: listingType === "Hotel" ? checkIn : undefined,
      checkOut: listingType === "Hotel" ? checkOut : undefined,
      noOfUnits: numItems,
      paymentDetails: {
        amount:totalPrice,
        paymentStatus: 'Pending' 
      },
    };
    

    try {
      const response = await fetch(`${config.api}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
    
      const result = await response.json();
      console.log("Server Response:", result);
    
      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }
    
      console.log("Booking successful:", result);
      setIsPaymentOpen(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.message || "Booking failed. Please try again.");
    }
    
  };

  return (
    <>
      {!isPaymentOpen && (
        <div
          id="popup-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => e.target.id === "popup-overlay" && onClose()}
        >
          <div className="bg-white p-4 rounded-md shadow-lg w-80 max-w-full relative z-50 text-sm">
            <h2 className="text-lg font-bold mb-1">{selectedUnit?.list.name || "Unit Details"}</h2>
            <p className="text-gray-600 mb-2">{selectedUnit?.list.address}</p>

            <div className="space-y-1 mb-3">
              <p><strong>Category:</strong> {selectedUnit?.category}</p>
              <p><strong>Price:</strong> ₹{selectedUnit?.price} per {listingType === "Hotel" ? "room" : "table"}</p>
              <p><strong>Availability:</strong> {selectedUnit?.availability.count} {listingType === "Hotel" ? "rooms" : "tables"}</p>
            </div>

            <div>
              <label className="block font-semibold">Select {listingType === "Hotel" ? "Room Type" : "Table Type"}:</label>
              <select
                className="border p-1 rounded w-full text-sm"
                value={selectedUnit?._id}
                onChange={(e) =>
                  setSelectedUnit(units.find((unit) => unit._id === e.target.value))
                }
              >
                {units.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.type} - ₹{unit.price}
                  </option>
                ))}
              </select>
            </div>

            {listingType === "Hotel" && (
              <>
                <div>
                  <label className="block font-semibold">Check-in:</label>
                  <input
                    type="date"
                    className="border p-1 rounded w-full text-sm"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold">Check-out:</label>
                  <input
                    type="date"
                    className="border p-1 rounded w-full text-sm"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold">{listingType === "Hotel" ? "Rooms" : "Tables"}:</label>
              <input
                type="number"
                className="border p-1 rounded w-full text-sm"
                min={1}
                max={selectedUnit?.availability || 1}
                value={numItems}
                onChange={(e) => setNumItems(e.target.value)}
              />
            </div>

            <p className="mt-3 text-base font-semibold">Total: ₹{totalPrice} INR</p>

            <div className="mt-3 flex justify-between">
              <button className="text-gray-600 text-sm" onClick={onClose}>Close</button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700" onClick={handleConfirmBooking}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      {isPaymentOpen && <PaymentGatewayPopup onClose={onClose} />}
    </>
  );
}

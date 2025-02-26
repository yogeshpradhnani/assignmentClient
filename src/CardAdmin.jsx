import { useState, useEffect } from "react";
import UnitListPopup from "./UnitListPopup";
import config from "../config";

export default function CardAdmin({ hotel, setHotels }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [hotelDetails, setHotelDetails] = useState(null);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleDelete = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!accessToken || role !== "admin") {
      showNotification("Unauthorized Access!", "error");
      return;
    }

    try {
      const response = await fetch(`${config.api}/list/${hotel._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        showNotification("Failed to delete listing!", "error");
        throw new Error("Failed to delete listing");
      }

      setIsDeletePopupOpen(false);
      showNotification("Unit deleted successfully!", "success");

      setHotels((prevHotels) => prevHotels.filter((h) => h._id !== hotel._id));
    } catch (error) {
      console.error("Error deleting listing:", error);
      showNotification("Failed to delete unit!", "error");
    }
  };



  const handleToggleActive = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${config.api}/list/${hotel._id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ isActive: !hotel.isActive }),
      });

      if (!response.ok) {
        showNotification("Failed to update status!", "error");
        return;
      }

      showNotification(`Unit ${hotel.isActive ? "Deactivated" : "Activated"} successfully!`, "success");

      // Update state to reflect new status
      setHotels((prevHotels) =>
        prevHotels.map((h) => (h._id === hotel._id ? { ...h, isActive: !hotel.isActive } : h))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification("Failed to update status!", "error");
    }
  };

  return (
    <div className="relative">
      <div className="CardVendor bg-base-100 w-72 shadow-xl">
        <figure className="px-2 pt-10">
          <img
            src={hotel.images?.length ? `${config.img}/${hotel.images[0]}` : `${config.img}/hotel.png`}
            alt={hotel.name}
            className="rounded-xl w-full h-40 object-cover"
          />
        </figure>
        <div className="CardVendor-body items-center text-center">
          <h2 className="CardVendor-title">{hotel.name}</h2>
          <p className="text-sm text-gray-500">{hotel.address}</p>
          <p className="text-sm">{hotel.description}</p>
          <p className="font-semibold">₹{hotel.pricing} INR</p>
          <p className={`text-sm ${hotel.isActive ? "text-green-600" : "text-red-600"}`}>
            {hotel.isActive ? "Available" : "Deactivated"}
          </p>

          <div className="CardVendor-actions w-full flex flex-col items-center m-1 p-2 gap-2">
        
            <button
              className={`btn w-full ${hotel.isActive ? "btn-warning" : "btn-success"}`}
              onClick={handleToggleActive}
            >
              {hotel.isActive ? "Deactivate" : "Activate"}
            </button>
            <button className="btn btn-danger w-full" onClick={() => setIsDeletePopupOpen(true)}>Delete</button>
          </div>
        </div>
      </div>

      {notification.message && (
        <div className={`fixed top-5 right-5 p-3 text-white text-center rounded-lg shadow-lg z-50 ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {notification.message}
        </div>
      )}

      {isPopupOpen && <UnitListPopup hotel={hotelDetails} onClose={() => setIsPopupOpen(false)} />}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full">
            <h2 className="text-xl font-bold">Confirm Deletion</h2>
            <p className="text-gray-600 mt-2">Are you sure you want to delete this unit?</p>
            <div className="flex justify-between mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={() => setIsDeletePopupOpen(false)}>Cancel</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

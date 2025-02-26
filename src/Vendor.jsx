import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardVendor from "./CardVendor";
import AddUnitPopup from "./AddUnitPopup";
import config from "../config";

export default function Vendor() {
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hotels, setHotels] = useState([]);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Fetch hotels on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!accessToken || role !== "vendor") {
      alert("Unauthorized Access!");
      navigate("/");
      return;
    }

    fetch(`${config.api}/list`)
      .then((response) => response.json())
      .then((data) => setHotels(data.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle click outside for mobile menu
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
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* ====== Desktop Sidebar (Fixed) ====== */}
      <div className="hidden md:block w-56 bg-white shadow-md p-4 mt-20 fixed h-full left-0">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li>
            <button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/bookings")}>
              Bookings
            </button>
          </li>
          <li>
            <button className="w-full text-left hover:text-blue-600 transition">
              Units
            </button>
          </li>
          <li>
            <button className="w-full text-left hover:text-blue-600 transition">
              Reviews
            </button>
          </li>
        </ul>
      </div>

      {/* ====== Main Content Area (Centered) ====== */}
      <div className="flex-1 flex flex-col items-center mt-20 mx-auto max-w-[900px] px-4">
        {/* ====== Mobile: "Add Unit" & "Menu" Buttons ====== */}
        <div className="md:hidden flex flex-col items-center mb-4">
          <button onClick={() => setShowPopup(true)} className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Unit
          </button>

          <button onClick={() => setShowMenu(!showMenu)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {showMenu ? "Close Menu" : "Open Menu"}
          </button>

          {showMenu && (
            <div ref={menuRef} className="mt-2 w-56 bg-white shadow-md p-4 rounded-lg z-50">
              <h2 className="text-xl font-bold mb-3">Menu</h2>
              <ul className="space-y-2">
                <li>
                  <button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/bookings")}>
                    Bookings
                  </button>
                </li>
                <li>
                  <button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/vendor")}>
                    Units
                  </button>
                </li>
                <li>
                  <button className="w-full text-left hover:text-blue-600 transition">
                    Reviews
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* ====== Desktop: "Add Unit" Button ====== */}
        <div className="hidden md:block mb-4">
          <button onClick={() => setShowPopup(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Unit
          </button>
        </div>

        {/* ====== Cards Section (Centered) ====== */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto place-items-center">
            {hotels.map((hotel) => (
              <CardVendor key={hotel._id} hotel={hotel} />
            ))}
          </div>
        </div>

        {/* ====== "Add Unit" Popup ====== */}
        {showPopup && <AddUnitPopup onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
}

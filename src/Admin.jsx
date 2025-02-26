import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardAdmin from "./CardAdmin";
import AddUnitPopup from "./AddUnitPopup";
import config from "../config";

export default function Admin() {
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hotels, setHotels] = useState([]);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!accessToken || role !== "admin") {
      alert("Unauthorized Access!");
      navigate("/login");
      return;
    }

    fetch(`${config.api}/list`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => response.json())
      .then((data) => setHotels(data.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [navigate]);

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
      <div className="hidden md:block w-56 bg-white shadow-md p-4 mt-20 fixed h-full left-0">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li><button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/bookings")}>Bookings</button></li>
          <li><button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/cardAdmin")}>Units</button></li>

        </ul>
      </div>

      <div className="flex-1 flex flex-col items-center mt-20 mx-auto max-w-[900px] px-4">
        <div className="md:hidden flex flex-col items-center mb-4">
          <button onClick={() => setShowPopup(true)} className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Unit</button>
          <button onClick={() => setShowMenu(!showMenu)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {showMenu ? "Close Menu" : "Open Menu"}
          </button>
          {showMenu && (
            <div ref={menuRef} className="mt-2 w-56 bg-white shadow-md p-4 rounded-lg z-50">
              <h2 className="text-xl font-bold mb-3">Menu</h2>
              <ul className="space-y-2">
                <li><button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/bookings")}>Bookings</button></li>
                <li><button className="w-full text-left hover:text-blue-600 transition" onClick={() => navigate("/admin")}>Units</button></li>

              </ul>
            </div>
          )}
        </div>



        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto place-items-center">
            {hotels.map((hotel) => (
              <CardAdmin key={hotel._id} hotel={hotel} setHotels={setHotels} />
            ))}
          </div>
        </div>

        {showPopup && <AddUnitPopup onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
}

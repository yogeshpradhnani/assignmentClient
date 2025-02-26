import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Import your components
import Navbar from "./Navbar";
import Home from "./Home";
import Vendor from "./Vendor";
import AuthForm from "./AuthForm"; // If you have an AuthForm route

import Bookings from "./Bookings";
import CustBookings from "./CustBooking";
import Admin from "./Admin";
import CardAdmin from "./CardAdmin";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar is always visible */}
      <Navbar />

      {/* Define routes for each page */}
      <Routes>
        {/* Home route (default) */}
        
        <Route path="/" element={<Home />} />

        {/* Vendor route */}
        <Route path="/vendor" element={<Vendor />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/customerBookings" element={<CustBookings />} />
        <Route path="/admin" element={<Admin />} />

        {/* Auth route (example, if you want a separate page) */}
        <Route path="/auth" element={<AuthForm onClose={() => {}} />} />
        <Route path="/auth" element={<AuthForm onClose={() => {}} />} />
        <Route path="/cardAdmin" element={<CardAdmin onClose={() => {}} />} />

        {/* 404 - Not Found (optional) */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

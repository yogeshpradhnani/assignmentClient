import React, { useState, useEffect } from "react";
import AuthForm from "./AuthForm";


export default function Navbar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsAuthenticated(true);
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Called by AuthForm after successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthOpen(false); // close Auth modal
  };

  // Logout removes tokens from localStorage
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[70px] bg-white shadow-md flex items-center px-6 lg:px-12 z-50">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-900">Hotel/Restaurant</div>

        {/* Desktop Middle Section */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-10">
          <button className="text-gray-700 hover:text-blue-600 transition text-lg"  >
            Home
          </button>

          {/* Search */}
          {/* <form className="flex items-center border border-gray-300 rounded-lg px-4 py-1">
            <input
              className="px-2 py-1 focus:outline-none w-64 text-gray-700"
              type="search"
              placeholder="Search..."
              aria-label="Search"
            />
            <button className="ml-3 px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
              Search
            </button>
          </form> */}
        </div>

        {/* Desktop Right Section */}
        {isAuthenticated ? (
          <button
            className="hidden lg:block px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="hidden lg:block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => setIsAuthOpen(true)}
          >
            Login / Signup
          </button>
        )}

        {/* Mobile Menu Icon */}
        <div className="flex-1 flex justify-end lg:hidden">
          <button
            className="text-gray-700 text-3xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-white shadow-lg flex flex-col items-center py-5 gap-4 transition-all">
            <button className="text-gray-700 hover:text-blue-600 transition text-lg" >
              Home
            </button>

            {/* Mobile Search */}
            {/* <form className="flex items-center border border-gray-300 rounded-lg px-4 py-1 w-3/4">
              <input
                className="px-2 py-1 focus:outline-none w-full text-gray-700"
                type="search"
                placeholder="Search..."
                aria-label="Search"
              />
              <button className="ml-3 px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                Search
              </button>
            </form> */}

            {/* Mobile: Login or Logout */}
            {isAuthenticated ? (
              <button
                className="mt-3 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setIsAuthOpen(true)}
              >
                Login / Signup
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthForm
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess} // pass callback
        />
      )}
    </>
  );
}

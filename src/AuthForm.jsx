import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function AuthForm({ onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer",
  });

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setFormData({ username: "", email: "", password: "", phone: "", address: "", role: "customer" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup
      ? `${config.api}/user/register`
      : `${config.api}/user/login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error occurred");

      alert(data.message || "Success!");

      if (data?.data) {
        const { accessToken, refreshToken, user } = data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("username", user?.username || "");
        localStorage.setItem("role", user?.role || "");

        if (!isSignup) {
          
          // navigate(user.role === "vendor" ? "/vendor" : "/");
          if(user.role=='vendor'){
            navigate("/vendor");
          }
          else if(user.role=="admin"){
          navigate("/admin");
        }
        else{
          navigate("/");
        }
      }
      }

      onLoginSuccess?.();
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">{isSignup ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isSignup && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          {isSignup && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              {["customer", "vendor"].map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          )}

          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button className="text-blue-600 ml-1" onClick={toggleMode}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

        <button className="mt-4 w-full text-center text-gray-600" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

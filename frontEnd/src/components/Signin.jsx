import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function SignIn() {
  const API_END_POINT = "http://localhost:8222/api/auth";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(API_END_POINT + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("email", formData.email);
        setIsLoggedIn(true);
        navigate("/welcome", {
          state: { userEmail: formData.email, userName: data.employeeName },
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Sign-in failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isLoggedIn={isLoggedIn} employeeName={formData.email} />
      <div className="flex items-center justify-center pt-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

          {errorMessage && (
            <p className="text-red-600 text-center p-2 mb-4 rounded-md bg-red-100">
              {errorMessage}
            </p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-800 text-white p-3 rounded-md hover:bg-sky-900 transition duration-300"
          >
            Sign In
          </button>

          <p className="text-center text-sm mt-4">
            <Link
              to="/forgot-password"
              className="text-sky-800 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;

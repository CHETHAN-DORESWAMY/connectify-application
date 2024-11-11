import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import Navbar from "./Navbar";

function SignIn() {
  const API_END_POINT = "http://localhost:8222/api/auth";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
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
          navigate("/welcome", { state: { userEmail: formData.email } });
          alert(data.message);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Sign-in failed");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        setErrorMessage("An error occurred. Please try again later.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Navbar positioned at the top */}
      <div className="flex items-center justify-center pt-16">
        <form
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 text-center p-2 mb-4 rounded-md bg-red-100">
              {errorMessage}
            </p>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>

          {/* Forgot Password Link */}
          <p className="text-center text-sm mt-4">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline"
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

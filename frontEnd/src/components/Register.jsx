import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const API_END_POINT = "http://localhost:8222/api/auth";
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const validate = () => {
    let errors = {};
    if (!formData.id) errors.id = "id is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email address is invalid";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(API_END_POINT + "/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const userData = await response.json();

        if (response.ok) {
          setServerMessage(userData.message);
          navigate("/signin");
        } else {
          setServerMessage(userData.message);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setServerMessage("An error occurred. Please try again later.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

        {/* Server Message */}
        {serverMessage && (
          <p
            className={`text-center p-2 mb-4 rounded-md ${
              serverMessage.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {serverMessage}
          </p>
        )}

        {/* Employee ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID
          </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.id && (
            <p className="text-red-600 text-sm mt-1">{errors.id}</p>
          )}
        </div>

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
          Register
        </button>

        {/* Sign In Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

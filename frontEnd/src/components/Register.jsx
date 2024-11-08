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
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {serverMessage && (
          <p
            className={`message ${
              serverMessage.includes("successfully") ? "success" : "error"
            }`}
          >
            {serverMessage}
          </p>
        )}
        <div>
          <label>Employee id</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
          {errors.id && <p className="error">{errors.id}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

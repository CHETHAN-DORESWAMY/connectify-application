import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../App.css"; // Assuming the CSS from Register page is already set up

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
    setErrorMessage(""); // Clear any existing error messages
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
          // Store token in localStorage for subsequent requests
          sessionStorage.setItem("authToken", data.token);
          console.log(sessionStorage.getItem("authToken"));
          navigate("/home", { state: { userEmail: formData.email } });

          alert(data.message);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Sign-in failed");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        setErrorMessage("An error occurred. Please try again later. ");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        {errorMessage && <p className="error">{errorMessage}</p>}

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

        <button type="submit">Sign In</button>

        <p className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;

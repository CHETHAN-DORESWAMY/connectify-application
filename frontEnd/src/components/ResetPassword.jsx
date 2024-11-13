import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  //   const API_END_URL = process.env.REACT_APP_API_END_URL;
  const API_END_URL = "http://localhost:8222/api/auth";

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowOtpField(false);
      setIsTimerRunning(false);
      setErrorMessage("OTP expired. Please request a new one.");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_END_URL}/send-otp?email=${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setShowOtpField(true);
        setTimer(300);
        setIsTimerRunning(true);
        setErrorMessage("");
      } else {
        const error = await response.json();
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_END_URL}/validate-otp?email=${email}&otp=${otp}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setShowOtpField(false);
        setShowPasswordFields(true);
        setIsTimerRunning(false);
        setErrorMessage("");
      } else {
        const error = await response.json();
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage("Failed to verify OTP. Please try again.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${API_END_URL}/reset-password?email=${email}&newPassword=${newPassword}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        navigate("/signin");
      } else {
        const error = await response.json();
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center pt-16">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Reset Password
          </h2>

          {errorMessage && (
            <p className="text-red-600 text-center p-2 mb-4 rounded-md bg-red-100">
              {errorMessage}
            </p>
          )}

          {!showOtpField && !showPasswordFields && (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-800 text-white p-3 rounded-md hover:bg-sky-900 transition duration-300"
              >
                Send OTP
              </button>
            </form>
          )}

          {showOtpField && (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  Time remaining: {formatTime(timer)}
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-800 text-white p-3 rounded-md hover:bg-sky-900 transition duration-300"
              >
                Verify OTP
              </button>
            </form>
          )}

          {showPasswordFields && (
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-800 text-white p-3 rounded-md hover:bg-sky-900 transition duration-300"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

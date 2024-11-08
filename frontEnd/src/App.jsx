import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';

// import "./App.css";
import "./index.css"
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div className="App">        
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />

          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

const SignIn = () => (
  <div className="center-content">
    <h2>Sign In Page (Under Construction)</h2>
  </div>
);

export default App;

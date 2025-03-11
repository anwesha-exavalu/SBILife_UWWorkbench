import React, { useState } from "react";
import "./Login.css"; // Import corresponding CSS file
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("underwriter"); // Default to underwriter login

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store the login type in localStorage so it can be accessed from other components
    localStorage.setItem('userRole', loginType);
    
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          HI, <span className="welcome">WELCOME!</span>
        </h1>
        <p className="login-subtitle">Login to your Intelligent Risk Assessment</p>
        
        <div className="login-tabs">
          <button 
            className={`login-tab ${loginType === "underwriter" ? "active" : ""}`}
            onClick={() => setLoginType("underwriter")}
          >
            Underwriter Login
          </button>
          <button 
            className={`login-tab ${loginType === "admin" ? "active" : ""}`}
            onClick={() => setLoginType("admin")}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Username" 
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="input-icon">&#128100;</span>
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="input-icon">&#128274;</span>
          </div>
          <div className="password-links">
            <a href="#forgot" className="link">
              Forgot Password
            </a>
            <a href="#change" className="link">
              Change Password
            </a>
          </div>
          <button type="submit" className="submit-button">
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
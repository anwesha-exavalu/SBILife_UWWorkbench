import React, { useState } from "react";
import "./Login.css"; // Import corresponding CSS file
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState(""); // Start with no role selected
  const [roleSelected, setRoleSelected] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store the login type in localStorage so it can be accessed from other components
    localStorage.setItem('userRole', loginType);
    
    navigate('/dashboard');
  };

  const handleRoleSelection = (role) => {
    setLoginType(role);
    setRoleSelected(true);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          HI, <span className="welcome">WELCOME!</span>
        </h1>
        <p className="login-subtitle">Login to your Intelligent Risk Assessment</p>
        
        {!roleSelected ? (
          <div className="role-selection">
            <h3 className="login-subtitle">Please select your role</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="loginType" 
                  value="underwriter" 
                  onChange={() => handleRoleSelection("underwriter")}
                  className="radio-input"
                />
                <span className="radio-text">Underwriter Login</span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="loginType" 
                  value="admin" 
                  onChange={() => handleRoleSelection("admin")}
                  className="radio-input"
                />
                <span className="radio-text">Admin Login</span>
              </label>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="role-display">
              <p className="selected-role">
                Selected Role: <span className="welcome">{loginType === "underwriter" ? "Underwriter" : "Admin"}</span>
                <button 
                  type="button" 
                  className="change-role-btn" 
                  onClick={() => setRoleSelected(false)}
                >
                  Change
                </button>
              </p>
            </div>
            
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Username" 
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // required
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
                // required
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
        )}
      </div>
    </div>
  );
};

export default Login;
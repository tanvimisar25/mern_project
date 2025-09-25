import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Login.css";

// Required imports for Realm
import { app } from "./App"; // Make sure the path to App.js is correct
import * as Realm from "realm-web";

function Login() {
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // State for handling login errors to display on the page
  const [error, setError] = useState(null);

  // State to control the success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      // Create credentials using the email and password state
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await app.logIn(credentials);
      
      // If login is successful, user object will be returned
      if (user) {
        // Show the success popup
        setShowSuccessPopup(true);

        // Wait for 2 seconds, then navigate to the homepage
        setTimeout(() => {
          navigate("/");
        }, 2000); // 2000 milliseconds = 2 seconds
      }
    } catch (err) {
      console.error("Login failed:", err);
      // Set the error message to display it to the user
      setError(err.error || "Wrong email or password. Try again!");
    }
  };

  return (
    <div className="login-page">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Success!</h2>
            <p>You have successfully signed in.</p>
          </div>
        </div>
      )}

      <div className="back-homepage">
        <Link to="/">&larr; Back to Homepage</Link>
      </div>

      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          
          {/* Display error message directly in the form */}
          {error && <p className="login-error-message">{error}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="login-footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Signup.css";

// ✅ 1. IMPORT THE REALM APP OBJECT
import { app } from "./App";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ 2. REPLACE YOUR HANDLESUBMIT FUNCTION WITH THIS ASYNC VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Keep your password match check
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Use a try...catch block to handle Realm registration
    try {
      // Register the user with their email and password
      await app.emailPasswordAuth.registerUser({ email, password });
      
      // If successful, alert the user and navigate to the login page
      alert("Success! You can now log in.");
      navigate("/login");

    } catch (error) {
      // Handle errors, such as if the email is already in use
      console.error("Error signing up:", error);
      alert("Something went wrong! " + error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="back-homepage">
        <Link to="/">&larr; Back to Homepage</Link>
      </div>

      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" name="username" required />
          <input type="email" placeholder="Email" name="email" required />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              required
              pattern="^(?=.*\d).{8,}$"
              title="Password must be at least 8 characters long and contain at least one number."
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
              />
            </span>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
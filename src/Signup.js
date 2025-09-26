import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Signup.css";
import * as Realm from "realm-web";

import { useAuth } from "./AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { app, login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    const formData = new FormData(e.target);
    
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // --- Validation Logic (No changes here) ---
    if (!email.endsWith("@gmail.com") && !email.endsWith("@somaiya.edu")) {
      setErrorMessage("Please use a valid Gmail or Somaiya address.");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage("Password must include uppercase, lowercase, a number, and be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // --- Signup Flow (No changes here) ---
      await app.emailPasswordAuth.registerUser({ email, password });
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await login(credentials);
      await user.functions.createUserData(username, email);
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000); 

    } catch (error) {
      console.error("Error signing up:", error);
      
      // ✅ THIS IS THE KEY CHANGE
      // We now check for the specific error from MongoDB Realm
      // and replace it with our own, more user-friendly message.
      if (error.error === 'name already in use') {
        setErrorMessage("Email already in use.");
      } else {
        // For all other errors, we can show a generic message.
        setErrorMessage("Failed to sign up. Please try again.");
      }
    }
  };

  return (
    // ... your JSX remains exactly the same
    <div className="signup-page">
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Account Created!</h2>
            <p>Logging you in and preparing your dashboard...</p>
          </div>
        </div>
      )}

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
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$"
              title="Must include uppercase, lowercase, a number, and be at least 6 characters."
            />
            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
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
            <span className="toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {errorMessage && <p className="signup-error-message">{errorMessage}</p>}
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
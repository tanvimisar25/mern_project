
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Signup.css";

// Import the Realm App object
import { app } from "./App";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State for handling form errors
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ 1. State to control the success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // --- Validation Logic ---
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

    // --- If Validation Passes, Register the User ---
    try {
      await app.emailPasswordAuth.registerUser({ email, password });
      
      // ✅ 2. Show the success popup
      setShowSuccessPopup(true);

      // ✅ 3. Wait for 3 seconds, then navigate to the login page
      setTimeout(() => {
        navigate("/login");
      }, 3000); // 3000 milliseconds = 3 seconds

    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage(error.error || "Failed to sign up. The email might already be in use.");
    }
  };

  return (
    <div className="signup-page">
      {/* ✅ 4. Add the popup JSX */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Account Created!</h2>
            <p>You can now log in. Redirecting...</p>
          </div>
        </div>
      )}

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
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$"
              title="Must include uppercase, lowercase, a number, and be at least 6 characters."
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
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {errorMessage && <p className="signup-error-message">{errorMessage}</p>}
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

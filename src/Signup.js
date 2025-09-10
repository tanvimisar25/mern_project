import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons"; 
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  // State for showing/hiding passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Confirm password check
    if (password !== confirmPassword) {
      e.target.confirmPassword.setCustomValidity("Passwords do not match.");
      e.target.confirmPassword.reportValidity(); // Show browser-style popup
      return;
    } else {
      e.target.confirmPassword.setCustomValidity(""); // Reset validity
    }

    navigate("/"); // Redirect to homepage
  };

  return (
    <div className="signup-page">
      {/* Back to Homepage outside the box */}
      <div className="back-homepage">
        <Link to="/">&larr; Back to Homepage</Link>
      </div>

      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" name="username" required />
          <input type="email" placeholder="Email" name="email" required />

          
          {/* Password with FontAwesome eye icon */}
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

{/* Confirm Password with FontAwesome eye icon */}
<div className="password-wrapper">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    name="confirmPassword"
    required
    onInput={(e) => e.target.setCustomValidity("")} // Reset validity on typing
  />
  <span
    className="toggle-eye"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
  </span>
</div>



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

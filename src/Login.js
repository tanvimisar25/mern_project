import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Login.css";

// --- REQUIRED IMPORTS ---
import { app } from "./App";
import * as Realm from "realm-web";
// ------------------------

function Login() {
  const navigate = useNavigate();

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // --- REPLACED FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("username"); // Using the 'username' field for email
    const password = formData.get("password");

    try {
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await app.logIn(credentials);
      // The user is logged in!
      alert("Welcome! You are logged in.");
      // Go to your main website page now
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Wrong email or password. Try again!");
    }
  };
  // -------------------------

  return (
    <div className="login-page">
      {/* Back to Homepage outside the box */}
      <div className="back-homepage">
        <Link to="/">&larr; Back to Homepage</Link>
      </div>

      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" name="username" required />

          {/* Password with eye toggle */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

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
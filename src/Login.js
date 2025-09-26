import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import * as Realm from "realm-web";
import "./Login.css";

// ✅ 1. IMPORT THE USEAUTH HOOK
import { useAuth } from './AuthContext'; 

function Login() {
  const navigate = useNavigate();
  // ✅ 2. GET THE 'login' FUNCTION FROM THE AUTH CONTEXT
  const { login } = useAuth();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // State for handling login errors
  const [error, setError] = useState(null);

  // State to control the success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const credentials = Realm.Credentials.emailPassword(email, password);
      
      // ✅ 3. USE THE 'login' FUNCTION FROM THE CONTEXT
      // This will log the user in AND update the global state for the whole app.
      await login(credentials);
      
      // If login is successful, show the popup
      setShowSuccessPopup(true);

      // Wait 2 seconds, then navigate to the homepage. The router in App.js
      // will see the user is logged in and show the correct page.
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      console.error("Login failed:", err);
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
            <p>You have successfully logged in.</p>
          </div>
        </div>
      )}

     
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


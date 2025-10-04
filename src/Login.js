import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Login.css";
import { useAuth } from './AuthContext'; 

/**
 * The Login component provides a user interface for authentication.
 * It handles form submission, API calls, error display, and success feedback.
 */
function Login() {
    // Hooks for navigation and authentication context.
    const navigate = useNavigate();
    const { login } = useAuth();

    // State to manage form inputs.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // State for UI/UX enhancements.
    const [showPassword, setShowPassword] = useState(false); // Toggles password visibility.
    const [error, setError] = useState(null); // Holds any login error messages.
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Controls the success popup visibility.

    /**
     * Handles the form submission event.
     * It prevents the default form action, calls the login function from the auth context,
     * and manages the UI state for success or error scenarios.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset any previous errors.

        try {
            // Attempt to log in with the provided credentials.
            await login(email, password);
            
            // On successful login, show a success popup.
            setShowSuccessPopup(true);

            // After a 2-second delay, redirect the user to their dashboard.
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

        } catch (err) {
            console.error("Login failed:", err);
            // On failure, set an error message to display to the user.
            setError(err.message || "An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="login-page">
            {/* Success Popup: Appears after a successful login before redirection. */}
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Success!</h2>
                        <p>Redirecting to your dashboard...</p>
                    </div>
                </div>
            )}

            {/* Main Login Form Container */}
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
                        {/* Password visibility toggle icon */}
                        <span
                            className="toggle-eye"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    
                    {/* Display error message if the login fails. */}
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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Login.css";

// ✅ We now import useAuth from our own custom AuthContext.
import { useAuth } from './AuthContext'; 

function Login() {
    const navigate = useNavigate();
    // ✅ This login function now comes from our AuthContext and calls our backend API.
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors on a new submission

        try {
            // ✅ Call the login function from our context with the user's credentials.
            await login(email, password);
            
            // If login is successful, show the success popup.
            setShowSuccessPopup(true);

            // After 2 seconds, navigate to the main dashboard.
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

        } catch (err) {
            // ✅ If login fails, our AuthContext throws an error. We catch it here.
            console.error("Login failed:", err);
            // The error message from our backend is now in err.message.
            setError(err.message || "An unexpected error occurred. Please try again.");
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
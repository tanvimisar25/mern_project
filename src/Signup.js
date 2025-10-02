import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Signup.css";

// ✅ Import useAuth from our custom AuthContext.
import { useAuth } from "./AuthContext";

function Signup() {
    const navigate = useNavigate();
    // ✅ Get the 'signup' function from our context (note the lowercase 'u').
    const { signup } = useAuth();

    // --- State Management for Form Inputs ---
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // --- State for UI Feedback ---
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        // --- Validation Logic (using state variables) ---
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
            // ✅ THIS IS THE KEY CHANGE: Call the signup function from our context.
            // This function sends the data to our Node.js backend API.
            await signup(username, email, password);

            // If signup is successful, show the popup.
            setShowSuccessPopup(true);
            
            // After 3 seconds, redirect to the login page to have the user log in.
            setTimeout(() => {
                navigate("/login"); 
            }, 3000); 

        } catch (error) {
            console.error("Error signing up:", error);
            // ✅ The error message from our backend is now in error.message.
            setErrorMessage(error.message || "Failed to sign up. Please try again.");
        }
    };

    return (
        <div className="signup-page">
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Account Created!</h2>
                        <p>Redirecting you to the login page...</p>
                    </div>
                </div>
            )}

            <div className="signup-box">
                <h2 className="signup-title">Sign Up</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
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
                        <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    <div className="password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Signup.css";
import { useAuth } from "./AuthContext";
import StatusModal from "./StatusModal";

/**
 * The Signup component provides a user interface for new user registration.
 * It handles form input, client-side validation, server-side signup requests,
 * and displays success or error feedback.
 */
function Signup() {
    // Hooks for navigation and authentication context.
    const navigate = useNavigate();
    const { signup } = useAuth();

    // State to manage form inputs.
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State for UI/UX enhancements.
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // State to control the status modal for success/error feedback.
    const [modalState, setModalState] = useState({
        isOpen: false,
        status: 'success',
        title: 'Account Created!',
        message: 'Redirecting you to the login page...'
    });

    /**
     * Handles the form submission event.
     * It performs client-side validation first. If validation passes, it attempts
     * to sign up the user via the authentication context and handles success or error responses.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear any previous errors.

        // Client-side Validation
        // Ensure email is from an allowed domain.
        if (!email.endsWith("@gmail.com") && !email.endsWith("@somaiya.edu")) {
            setErrorMessage("Please use a valid Gmail or Somaiya address.");
            return;
        }
        // Ensure the password meets complexity requirements.
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMessage("Password must include uppercase, lowercase, a number, and be at least 6 characters.");
            return;
        }
        // Ensure passwords match.
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // Server-side Signup Attempt
        try {
            // Call the signup function from the authentication context.
            await signup(username, email, password);

            // On success, show the success modal.
            setModalState({ ...modalState, isOpen: true });
            
            // After a 2-second delay, redirect the user to the login page.
            setTimeout(() => {
                navigate("/login"); 
            }, 2000);

        } catch (error) {
            // If the signup function throws an error (e.g., email already exists),
            // display the error message from the server.
            console.error("Error signing up:", error);
            setErrorMessage(error.message || "Failed to sign up. Please try again.");
        }
    };

    return (
        <div className="signup-page">
            {/* The status modal is rendered here but is only visible when `isOpen` is true. */}
            <StatusModal
                isOpen={modalState.isOpen}
                status={modalState.status}
                title={modalState.title}
                message={modalState.message}
            />

            <div className="signup-box">
                <h2 className="signup-title">Sign Up</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    
                    {/* Password Input with Visibility Toggle */}
                    <div className="password-wrapper">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>

                    {/* Confirm Password Input with Visibility Toggle */}
                    <div className="password-wrapper">
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <span className="toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    
                    {/* Display any validation or server error messages. */}
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
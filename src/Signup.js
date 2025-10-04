import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Signup.css";
import { useAuth } from "./AuthContext";
import StatusModal from "./StatusModal";

function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [modalState, setModalState] = useState({
        isOpen: false,
        status: 'success',
        title: 'Account Created!',
        message: 'Redirecting you to the login page...'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors

        // --- Client-side validation (unchanged) ---
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

        // --- ✅ CORRECTED Server-side validation and signup ---
        try {
            // We try to sign the user up...
            await signup(username, email, password);

            // If it succeeds, we show the success modal and plan the redirect.
            setModalState({ ...modalState, isOpen: true });
            
            setTimeout(() => {
                navigate("/login"); 
            }, 2000);

        } catch (error) {
            // If the signup function throws an error (because the server sent back a 409 error),
            // this 'catch' block will execute.
            console.error("Error signing up:", error);

            // We then take the error message from the server (e.g., "Email already in use.")
            // and set it as our errorMessage, which will display it on the screen.
            setErrorMessage(error.message || "Failed to sign up. Please try again.");
        }
    };

    return (
        <div className="signup-page">
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
                    <div className="password-wrapper">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    <div className="password-wrapper">
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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
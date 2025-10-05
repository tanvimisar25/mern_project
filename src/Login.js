import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./Login.css";
import { useAuth } from './AuthContext'; 


function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [showPassword, setShowPassword] = useState(false); 
    const [error, setError] = useState(null); 
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); 

  
    const handleSubmit = async (e) => {
        e.preventDefault(); //It prevents the default form action, calls the login function from the auth context
        setError(null); // Reset any previous errors.

        try {
            await login(email, password);
            
            setShowSuccessPopup(true);

            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="login-page">
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Success!</h2>
                        <p>Redirecting to your dashboard...</p>
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
import React from 'react';
import Navbar from '../Navbar/Navbar.jsx';

const Login = () => {
    return (
        <>
            <Navbar />
            <div className="form-container">
                {/* Title Section */}
                <div className="title-section">
                    <h1 className="title">Log in to your account</h1>
                </div>

                {/* Social Login Section */}
                <div className="social-login">
                    <button className="google-btn">
                        <div className="google-icon" aria-label="Google icon"></div>
                        <span className="login-now-text">Login now</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="divider">
                    <span>Or</span>
                </div>

                {/* Form Fields Section */}
                <form className="form-fields">
                    <div className="field-group">
                        <label className="field-label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="field-group">
                        <div className="field-label">
                            <span className="label-text">Password</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Enter your password"
                                required
                            />
                            <div
                                className="eye-icon"
                                style={{ position: 'absolute', right: '16px', top: '12px' }}
                                aria-label="Toggle password visibility"
                            ></div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-btn">
                        Log in
                    </button>
                </form>

                {/* Footer */}
                <div className="footer">
                    <div className="footer-text">
                        <span className="footer-link">Forgot passeword ?</span>
                        <a href="#" className="login-link">Click here</a>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Login;

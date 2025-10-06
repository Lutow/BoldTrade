import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Login.css';
import Navbar from '../Navbar/Navbar.jsx';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Rediriger si déjà connecté
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/exchange');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                navigate('/exchange');
            } else {
                setErrors({ general: result.error });
            }
        } catch {
            setErrors({ general: 'An error occurred during login' });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                    <button type="button" className="google-btn" disabled>
                        <div className="google-icon" aria-label="Google icon"></div>
                        <span className="login-now-text">Login now</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="divider">
                    <span>Or</span>
                </div>

                {/* Form Fields Section */}
                <form className="form-fields" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="error-message" style={{ 
                            color: '#ef4444', 
                            marginBottom: '16px', 
                            padding: '12px', 
                            border: '1px solid #ef4444', 
                            borderRadius: '8px', 
                            background: '#fef2f2' 
                        }}>
                            {errors.general}
                        </div>
                    )}

                    <div className="field-group">
                        <label className="field-label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`input-field ${errors.email ? 'error' : ''}`}
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && (
                            <span className="field-error" style={{ color: '#ef4444', fontSize: '14px' }}>
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="field-group">
                        <div className="field-label">
                            <span className="label-text">Password</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`input-field ${errors.password ? 'error' : ''}`}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <div
                                className="eye-icon"
                                style={{ 
                                    position: 'absolute', 
                                    right: '16px', 
                                    top: '12px',
                                    cursor: 'pointer',
                                    fontSize: '18px'
                                }}
                                onClick={togglePasswordVisibility}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </div>
                        </div>
                        {errors.password && (
                            <span className="field-error" style={{ color: '#ef4444', fontSize: '14px' }}>
                                {errors.password}
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1 }}
                    >
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                {/* Footer */}
                <div className="footer">
                    <div className="footer-text">
                        <span className="footer-link">Don't have an account yet?</span>
                        <Link to="/register" className="login-link">Sign up</Link>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Login;

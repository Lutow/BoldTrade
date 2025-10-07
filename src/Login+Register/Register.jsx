import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Register.css';
import Navbar from '../Navbar/Navbar.jsx';
import LaserFlow from '../animations/LaserFlow.tsx';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, isAuthenticated } = useAuth();
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
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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
            const result = await register(formData.email, formData.password, formData.confirmPassword);

            if (result.success) {
                navigate('/exchange');
            } else {
                setErrors({ general: result.error });
            }
        } catch {
            setErrors({ general: 'An error occurred during registration' });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <Navbar />
            <LaserFlowBoxExample
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                togglePasswordVisibility={togglePasswordVisibility}
                toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
            />
        </>
    );
};

// Composant LaserFlow avec le formulaire
function LaserFlowBoxExample({ formData, errors, isLoading, showPassword, showConfirmPassword, handleChange, handleSubmit, togglePasswordVisibility, toggleConfirmPasswordVisibility }) {
  const revealImgRef = useRef(null);

  return (
    <div
      style={{
        height: '1200px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060010'

      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.2}
        verticalBeamOffset={0.3}
        color="#AE9EFF"
        verticalSizing={5.0}
        horizontalSizing={0.6}
        wispDensity={5}
        wispSpeed={14.5}
        wispIntensity={12.6}
        flowSpeed={0.95}
        flowStrength={0.25}
        fogIntensity={0.45}
        fogScale={0.3}
        fogFallSpeed={2}
        decay={1.1}
        falloffStart={0.89}
      />

      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '86%',
        height: '60%',
        backgroundColor: '#060010',
        borderRadius: '20px',
        border: '2px solid #AE9EFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        zIndex: 6
      }}>
            <div className="form-container">
                {/* Title Section */}
                <div className="title-section">
                    <h1 className="title">Create an account</h1>
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

                    <div className="field-group">
                        <div className="field-label">
                            <span className="label-text">Confirm Password</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
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
                                onClick={toggleConfirmPasswordVisibility}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </div>
                        </div>
                        {errors.confirmPassword && (
                            <span className="field-error" style={{ color: '#ef4444', fontSize: '14px' }}>
                                {errors.confirmPassword}
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
                        {isLoading ? 'Création...' : 'Create account'}
                    </button>
                </form>

                {/* Footer */}
                <div className="footer">
                    <div className="footer-text">
                        <span className="footer-link">Already have an account?</span>
                        <Link to="/login" className="login-link">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Register;

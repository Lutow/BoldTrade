import React from 'react';
import './Register.css';
import Navbar from '../Navbar/Navbar.jsx';
import LaserFlow from '../animations/LaserFlow.tsx';
import { useRef } from 'react';


const Register = () => {

    return (
        <>
            <Navbar />
            <div style={{ height: '50000px', position: 'relative', overflow: 'hidden' }}>
                <LaserFlowBoxExample />
            </div>
        </>
    );
}

// Image Example Interactive Reveal Effect
function LaserFlowBoxExample() {
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
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.0}
        color="#FF79C6"
      />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '86%',
        height: '60%',
        backgroundColor: '#060010',
        borderRadius: '20px',
        border: '2px solid #FF79C6',
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
                        Create account
                    </button>
                </form>

                {/* Footer */}
                <div className="footer">
                    <div className="footer-text">
                        <span className="footer-link">Already have an account?</span>
                        <a href="#" className="login-link">Log in</a>
                    </div>
                </div>
            </div>
        </div>

      <img
        ref={revealImgRef}
        src="/path/to/image.jpg"
        alt="Reveal effect"
        style={{
          position: 'absolute',
          width: '100%',
          top: '-50%',
          zIndex: 5,
          mixBlendMode: 'lighten',
          opacity: 0.3,
          pointerEvents: 'none',
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        }}
      />
    </div>
  );
}

export default Register;

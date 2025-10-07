import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Navbar.css';
import logo from '../assets/Logo.png';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return(
        <div className="navbar">
            <div className="container">
                <div className="navbar-logo">
                    <Link to="/"><img src={logo} alt="Bold Trade" /></Link>
                </div>
                <ul className="navbar-nav">
                    <li><Link to="/Exchange">Exchange</Link></li>
                    {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
                    <li>Support</li>
                    <li>About Us</li>
                </ul>
                {isAuthenticated ? (
                    <ul className="navbar-LoginRegister">
                        <li style={{ color: '#fff', fontSize: '14px' }}>
                            Hello, {user?.email?.split('@')[0]}
                        </li>
                        <li>
                            <Link 
                                to="/add-funds" 
                                style={{ 
                                    color: '#fff', 
                                    fontSize: '14px', 
                                    marginRight: '10px',
                                    textDecoration: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid transparent',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.border = '1px solid #665DCD';
                                    e.target.style.background = 'rgba(102, 93, 205, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.border = '1px solid transparent';
                                    e.target.style.background = 'transparent';
                                }}
                                title="Click to add funds"
                            >
                                Balance: ${user?.portfolio?.balance?.toLocaleString() || '0'} +
                            </Link>
                        </li>
                        <li>
                            <button 
                                onClick={handleLogout}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #fff',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                LOGOUT
                            </button>
                        </li>
                    </ul>
                ) : (
                    <ul className="navbar-LoginRegister">
                        <li className="login"><Link to="/login">LOGIN</Link></li>
                        <li><Link to="/register"><button>SIGN UP</button></Link></li>
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Navbar;

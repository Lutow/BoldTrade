import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
    return(
        <div className="navbar">
            <div className="container">
                <div className="navbar-logo">
                    <Link to="/">Bold Trade</Link>
                </div>
                <ul className="navbar-nav">
                    <li><Link to="/Exchange">Exchange</Link></li>
                    <li>Support</li>
                    <li>About Us</li>
                </ul>
                <ul className="navbar-LoginRegister">
                    <li><Link to="/login">LOGIN</Link></li>
                    <li><Link to="/register"><button>SIGN UP</button></Link></li>
                </ul>
            </div>
        </div>


    )
}

export default Navbar;

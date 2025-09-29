import React from 'react';
import './Navbar.css';


const Navbar = () => {
    return(
        <div className="navbar">
            <div className="container">
                <div className="navbar-logo">
                    <a href="/">Bold Trade</a>
                </div>
                <ul className="navbar-nav">
                    <li>Exchange</li>
                    <li>Support</li>
                    <li>About Us</li>
                    <li>Login</li>
                    <li>Sign up</li>
                </ul>
            </div>
        </div>


    )
}

export default Navbar;
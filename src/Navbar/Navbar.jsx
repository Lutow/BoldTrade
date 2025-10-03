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
                </ul>
                <ul className="navbar-LoginRegister">
                    <li className="login"><a href="/login">LOGIN</a></li>
                    <li><a href="/signup"><button>SIGN UP</button></a></li>
                </ul>
            </div>
        </div>


    )
}

export default Navbar;

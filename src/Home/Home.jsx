import React from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar.jsx';

const Home = () => {
    return(
        <div className="container">
            <Navbar />
            <div className="hero">
                <h1 className="hero-title">Bold Trade</h1>
                <h3 className="hero-subtitle">Stock Market</h3>
            </div>
        </div>
    )
}

export default Home;
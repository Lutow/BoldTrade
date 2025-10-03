import React from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar.jsx';

const Home = () => {
    return(
        <div className="container">
            <Navbar />
            <div className="hero">
                <p className="hero-title">BoldTrade</p>
                <p className="hero-subtitle">Stock Market</p>
                <p className="hero-subtitle2">The best trading platform provides 24/7 liquidity</p>
                <button className="hero-btn">GET IN TOUCH</button>
            </div>
        </div>
    )
}

export default Home;

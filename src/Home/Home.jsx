import React from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar.jsx';
import { FaChartBar, FaUser, FaGlobe } from "react-icons/fa";

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
            <div className="numbers-container">
                <ul className="numbers-list">
                    <li>
                        <div className="stat">
                            <div className="icon-circle">
                                <FaChartBar />
                            </div>
                            <div className="stat-bloc">
                                <h3 className="stat-title">$30B</h3>
                                <p>Digital Currency Exchanged</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="stat">
                            <div className="icon-circle">
                                <FaUser />
                            </div>
                            <div className="stat-bloc">
                                <h3 className="stat-title">10M+</h3>
                                <p>Trusted Wallets Investors</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="stat">
                            <div className="icon-circle">
                                <FaGlobe />
                            </div>
                            <div className="stat-bloc">
                                <h3 className="stat-title">195</h3>
                                <p>Countries Supported</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="choose-us">
                <div className="GPU-illustration">
                    <img src="src/assets/illustration.jpg" alt="GPU-circuit-illustration"/>
                </div>
                <div className="choose-us-text">
                    <h1 className="choose-title">Why would you choose BoldTrade</h1>
                    <p className="choose-paragraph">Experience the next generation cryptocurrency platform. No financial borders, extra fees, and fake reviews.</p>
                    <button className="choose-btn">LEARN MORE</button>
                </div>
            </div>
        </div>
    )
}

export default Home;

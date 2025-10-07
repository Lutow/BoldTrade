import React from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';
import { FaChartBar, FaUser, FaGlobe } from "react-icons/fa";

const Home = () => {
    return(
        <div className="home-page">
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

                <div className="crypto-market-making">
                    <h1 className="crypto-market-title">Crypto Market Making</h1>
                    <p className="crypto-market-paragraph">
                        We are a global crypto liquidity provider and algorithmic market maker.
                        We trade digital assets listed on Centralized Exchanges in over 15 countries worldwide.
                    </p>

                    <div className="crypto-podium-container">
                        <div className="crypto-podium-text">
                            <h2 className="crypto-podium-title">Market Making for Crypto Projects</h2>
                            <p className="crypto-podium-subtitle">
                                Accelerate your token’s journey by boosting its liquidity
                            </p>
                            <p className="crypto-podium-paragraph">
                                We invest in building long-term, sustainable relationships and support
                                our projects in their growth journey with our services, industry expertise and network.
                            </p>
                        </div>

                        <div className="crypto-podium-image">
                            <img src="src/assets/podium-crypto.jpg" alt="podium-crypto" />
                        </div>
                    </div>
                </div>
                <div className="crypto-charts">
                    <div className="crypto-charts-img">
                        <img src="src/assets/charts-crypto.jpg" alt="charts-crypto" />
                    </div>
                    <div className="crypto-charts-text">
                        <h2 className="crypto-podium-title">Market Making for Crypto Exchanges</h2>
                        <p className="crypto-charts-subtitle">
                                Attract more traders and projects with deep order books & liquidity
                        </p>
                        <p className="crypto-charts-paragraph">
                                Our world-class market making services are proven to help local and emerging exchanges win traders and gain market-leading positions of up to 90% market dominance.
                        </p>
                    </div>
                </div>

                <h1 className="team-section-title">Meet The Team</h1>

                <div className="dev-team-container">
                    <div className="member-card">
                        <div className="member-card-img">
                            <img src="src/assets/TL%20pfp.jpeg" alt="TL" />
                        </div>
                        <p className="employee-name">
                            Timothée Landelle
                        </p>
                        <p className="employee-role">
                            Developper
                        </p>
                        <p className="employee-description">
                            Software Engineering Student at EFREI Paris
                        </p>
                    </div>
                    <div className="member-card">
                        <div className="member-card-img">
                            <img src="src/assets/AK%20pfp.jpeg" alt="AK" />
                        </div>
                        <p className="employee-name">
                            Alexandre Kalaydjian
                        </p>
                        <p className="employee-role">
                            Developper
                        </p>
                        <p className="employee-description">
                            Software Engineering Student at EFREI Paris
                        </p>
                    </div>
                    <div className="member-card">
                        <div className="member-card-img">
                            <img src="src/assets/CL%20pfp.jpeg" alt="CL" />
                        </div>
                        <p className="employee-name">
                            Clément Laatar
                        </p>
                        <p className="employee-role">
                            Developper
                        </p>
                        <p className="employee-description">
                            Software Engineering Student at EFREI Paris
                        </p>
                    </div>
                </div>
                <div className="RUready-container">
                    <h1 className="RUready-section-title">Are You Ready?</h1>
                    <h1 className="RUready-bigger-title">Be A Part Of The Next Big Thing</h1>
                    <button className="choose-btn">GET STARTED</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home;

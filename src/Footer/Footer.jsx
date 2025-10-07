// Footer.jsx
import React from "react";
import { Youtube, Twitter, Linkedin } from "lucide-react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="site-footer" role="contentinfo">
            <div className="site-footer__inner">
                <div className="site-footer__top">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src="src/assets/Logo2.png" alt="TL" />
                        </div>
                        <p className="footer-tagline">Trusted crypto liquidity & market making</p>
                    </div>

                    <nav className="footer-nav" aria-label="Footer navigation">
                        <div className="footer-col">
                            <h4 className="footer-col__title">Product</h4>
                            <ul className="footer-links">
                                <li><a href="/">Home</a></li>
                                <li><a href="/Exchange">Exchange</a></li>
                                <li><a href="/add-funds">Wallets</a></li>
                                <li><a href="#">Documentation</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-col__title">Support</h4>
                            <ul className="footer-links">
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Contact Support</a></li>
                                <li><a href="#">Community</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-col__title">Company</h4>
                            <ul className="footer-links">
                                <li><a href="#">About us</a></li>
                                <li><a href="#">Contact us</a></li>
                                <li><a href="#">Terms</a></li>
                                <li><a href="#">Privacy</a></li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="site-footer__bottom">
                    <p className="site-footer__copy">© {new Date().getFullYear()} BoldTrade. All rights reserved.</p>

                    <div className="site-footer__legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>

                    <div className="site-footer__social" aria-label="Social links">
                        <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                        <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

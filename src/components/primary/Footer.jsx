import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <footer className="bottom">
                <div className="brand-block">
                    <div className="name">Scentanyl<em>.</em></div>
                    <p>A working archive of considered perfumery. Bring an opinion; leave with three.</p>
                </div>
                <div>
                    <h4>Browse</h4>
                    <ul>
                        <li><Link to="/fragrances">Fragrances</Link></li>
                        <li><Link to="/brands">Brands</Link></li>
                        <li><Link to="/notes">Notes</Link></li>
                        <li><Link to="/accords">Accords</Link></li>
                        <li><Link to="/perfumers">Perfumers</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>The Salon</h4>
                    <ul>
                        <li><Link to="/salon">Threads</Link></li>
                        <li><Link to="/salon">Annotations</Link></li>
                        <li><Link to="/salon">Perfumers in residence</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>House</h4>
                    <ul>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/privacy-policy">Privacy</Link></li>
                    </ul>
                </div>
            </footer>
            <div className="colophon">
                <span>© Scentanyl, {new Date().getFullYear()}</span>
                <span>A working archive of considered perfumery</span>
                <span>Set in Bodoni Moda &amp; Inter</span>
            </div>
        </>
    );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="text-white font-bold py-6 px-4 sm:px-6 lg:px-12 mt-10">
            <div className="mx-auto flex flex-col sm:flex-row justify-between items-center text-sm xs:text-xs lg:text-xl space-y-2 sm:space-y-0">
                <div>&copy; {new Date().getFullYear()} Scentanyl. All rights reserved.</div>
                <div className="flex space-x-6">
                    <Link to="/about" className={`cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-1 sm:px-2 py-0.5 sm:py-1`}>About</Link>
                    <Link to="/contact" className={`cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-1 sm:px-2 py-0.5 sm:py-1`}>Contact</Link>
                    <Link to="/privacy" className={`cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-1 sm:px-2 py-0.5 sm:py-1`}>Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

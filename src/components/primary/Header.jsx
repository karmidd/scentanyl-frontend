import GooeyNav from "../../blocks/Components/GooeyNav/GooeyNav.jsx";
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import ThemeToggleButton from "../utils/ThemeToggleButton.jsx";

const items = [
    { label: "Home", href: "/" },
    { label: "Fragrances", href: "/fragrances" },
    { label: "Brands", href: "/brands" },
    { label: "Notes", href: "/notes" },
    { label: "Accords", href: "/accords" },
    { label: "Perfumers", href: "/perfumers" },
];

const Header = ({ page }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.mobile-more-menu')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [mobileMenuOpen]);

    return (
        <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
            }`}
        >
            {/* Desktop Layout - horizontal */}
            <div className="hidden md:flex items-center px-6 lg:px-12 h-[150px] text-xl lg:text-2xl xl:text-3xl relative">
                {/* Logo - positioned on left and vertically centered */}
                <div className="flex-1 flex justify-start items-center h-full">
                    <Link
                        to="/"
                        className="text-white hover:scale-102 text-4xl lg:text-5xl font-['Sarina',serif] transition-transform duration-100"
                    >
                        scentanyl
                    </Link>
                </div>

                {/* Centered navigation - absolutely centered */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <GooeyNav
                        items={items}
                        particleCount={15}
                        particleDistances={[60, 30]}
                        particleR={100}
                        initialActiveIndex={page}
                        animationTime={600}
                        timeVariance={300}
                        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                    />
                </div>

                {/* Theme toggle button - positioned on right and vertically centered */}
                <div className="flex-1 flex justify-end items-center h-full">
                    <ThemeToggleButton className="cursor-pointer" />
                </div>
            </div>

            {/* Mobile Layout - stacked */}
            <div className="md:hidden flex flex-col items-center px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3">
                {/* Top row: Logo centered with theme button on right */}
                <div className="w-full flex items-center justify-center relative mb-2 sm:mb-3">
                    <Link
                        to="/"
                        className="text-white hover:scale-105 text-2xl sm:text-3xl font-['Sarina',serif] transition-transform duration-200"
                    >
                        scentanyl
                    </Link>
                    {/* Theme toggle positioned absolutely on the right */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                        <ThemeToggleButton className="cursor-pointer" />
                    </div>
                </div>

                {/* Bottom row: Navigation centered */}
                <div className="flex justify-center">
                    <div className="flex space-x-3 sm:space-x-4 text-sm sm:text-base">
                        {items.slice(0, 4).map((item, index) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`text-white hover:text-blue-300 transition-colors duration-200 px-1 py-1 ${
                                    index === page ? 'text-blue-400 font-semibold' : ''
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {/* More menu for remaining items - click-based */}
                        <div className="relative mobile-more-menu">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white hover:text-blue-300 cursor-pointer px-1 py-1 focus:outline-none"
                            >
                                More {mobileMenuOpen ? '▲' : '▼'}
                            </button>
                            {mobileMenuOpen && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-lg py-2 px-3 space-y-1 min-w-[100px] mt-1 z-10">
                                    {items.slice(4).map((item) => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-white hover:text-blue-300 transition-colors duration-200 py-1 text-sm whitespace-nowrap text-center"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
import GooeyNav from "../../blocks/Components/GooeyNav/GooeyNav.jsx";
import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import ThemeToggleButton from "../utils/buttons/ThemeToggleButton.jsx";

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
    const [useStackedLayout, setUseStackedLayout] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Check if we should use stacked layout based on screen dimensions
    useEffect(() => {
        const checkLayout = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Use stacked layout if:
            // - Width is less than 1800px OR
            // - Screen is very wide but very short (like Nest Hub Max: width > 1200 but height < 600)
            const shouldStack = width < 1800 || (width > 1200 && height < 600);
            setUseStackedLayout(shouldStack);
        };

        checkLayout();
        window.addEventListener('resize', checkLayout);
        return () => window.removeEventListener('resize', checkLayout);
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
        <>
            {/* CSS for smooth animations */}
            <style jsx>{`
                @keyframes slideDown {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes slideUp {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                }

                .dropdown-enter {
                    animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .dropdown-exit {
                    animation: slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .arrow-rotate {
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .arrow-up {
                    transform: rotate(180deg);
                }

                .more-button-hover {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .more-button-hover:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
                }

                .dropdown-item-enter {
                    animation: itemSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes itemSlideIn {
                    0% {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>

            <div
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
                }`}
            >
                {/* Large Desktop Layout - horizontal with absolute positioning */}
                {!useStackedLayout && (
                    <div className="flex items-center px-6 lg:px-12 h-[150px] text-xl lg:text-2xl xl:text-3xl relative">
                        {/* Logo - positioned on left and vertically centered */}
                        <div className="flex-1 flex justify-start items-center h-full">
                            <Link
                                to="/"
                                className="text-white hover:scale-102 text-3xl lg:text-4xl font-['Sarina',serif] transition-transform duration-100"
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
                )}

                {/* Stacked Layout - for smaller screens, short screens, or wide aspect ratios */}
                {useStackedLayout && (
                    <>
                        {/* Desktop/Tablet Stacked Layout */}
                        <div className="hidden sm:flex flex-col items-center px-4 pt-3 pb-2">
                            {/* Top row: Logo centered with theme button on right */}
                            <div className="w-full flex items-center justify-center relative mb-3">
                                <Link
                                    to="/"
                                    className="text-white hover:scale-105 text-2xl md:text-3xl font-['Sarina',serif] transition-transform duration-200"
                                >
                                    scentanyl
                                </Link>
                                {/* Theme toggle positioned absolutely on the right */}
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                    <ThemeToggleButton className="cursor-pointer" />
                                </div>
                            </div>

                            {/* Bottom row: Navigation centered with visual selection indicators */}
                            <div className="flex justify-center">
                                <div className="flex space-x-3 md:space-x-4 text-sm md:text-base">
                                    {items.map((item, index) => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={`relative px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                                                index === page
                                                    ? 'text-black font-semibold bg-white shadow-lg transform scale-105'
                                                    : 'text-white hover:text-blue-300 hover:bg-white/10'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Layout - stacked with dropdown */}
                        <div className="sm:hidden flex flex-col items-center px-3 pt-3 pb-2">
                            {/* Top row: Logo centered with theme button on right */}
                            <div className="w-full flex items-center justify-center relative mb-2">
                                <Link
                                    to="/"
                                    className="text-white hover:scale-105 text-2xl font-['Sarina',serif] transition-transform duration-200"
                                >
                                    scentanyl
                                </Link>
                                {/* Theme toggle positioned absolutely on the right */}
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                    <ThemeToggleButton className="cursor-pointer" />
                                </div>
                            </div>

                            {/* Bottom row: Navigation centered with dropdown for overflow */}
                            <div className="flex justify-center">
                                <div className="flex space-x-3 text-sm">
                                    {items.slice(0, 4).map((item, index) => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={`relative px-2 py-1 rounded transition-all duration-300 ${
                                                index === page
                                                    ? 'text-black font-semibold bg-white shadow-md'
                                                    : 'text-white hover:text-blue-300 hover:bg-white/10'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    {/* More menu for remaining items - click-based with animations */}
                                    <div className="relative mobile-more-menu">
                                        <button
                                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                            className="more-button-hover text-white hover:text-blue-300 cursor-pointer px-3 py-1 focus:outline-none hover:bg-white/10 rounded transition-all duration-300 flex items-center space-x-1 bg-white/5 border border-white/20"
                                        >
                                            <span>More</span>
                                            <span
                                                className={`arrow-rotate text-xs ${mobileMenuOpen ? 'arrow-up' : ''}`}
                                            >
                                                ▼
                                            </span>
                                        </button>
                                        {mobileMenuOpen && (
                                            <div className="dropdown-enter absolute top-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-md rounded-lg py-2 px-3 space-y-1 min-w-[100px] mt-2 z-50 border border-white/20 shadow-xl">
                                                {items.slice(4).map((item, index) => (
                                                    <Link
                                                        key={item.href}
                                                        to={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`dropdown-item-enter block px-3 py-2 rounded transition-all duration-300 text-sm whitespace-nowrap text-center hover:scale-105 ${
                                                            (index + 4) === page
                                                                ? 'text-black font-semibold bg-white shadow-sm'
                                                                : 'text-white hover:text-blue-300 hover:bg-white/20'
                                                        }`}
                                                        style={{
                                                            animationDelay: `${index * 50}ms`
                                                        }}
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
                    </>
                )}
            </div>
        </>
    );
};

export default Header;
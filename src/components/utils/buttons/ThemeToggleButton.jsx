// components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const ThemeToggleButton = ({ className = '' }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12
                rounded-full transition-all duration-300
                ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}
                border border-gray-300 dark:border-gray-700
                shadow-md hover:scale-105
                ${className}
            `}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                {/* Sun Icon */}
                <svg
                    className={`
                        absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 transform
                        ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="5" strokeWidth="2" />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    />
                </svg>

                {/* Moon Icon */}
                <svg
                    className={`
                        absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 transform
                        ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            </div>
        </button>
    );
};

export default ThemeToggleButton;

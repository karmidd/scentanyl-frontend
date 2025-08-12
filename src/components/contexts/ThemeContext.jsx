// contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage for saved preference, default to dark
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    // Update localStorage when theme changes
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        // Add/remove dark class to html element for global CSS if needed
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const theme = {
        // Background colors
        bg: {
            primary: isDarkMode ? 'bg-black' : 'bg-white',
            secondary: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
            tertiary: isDarkMode ? 'bg-gray-800' : 'bg-gray-200',
            card: isDarkMode ? 'bg-gray-800' : 'bg-white',
            input: isDarkMode ? 'bg-gray-900' : 'bg-indigo-100',
        },

        // Text colors
        text: {
            primary: isDarkMode ? 'text-white' : 'text-gray-800',
            secondary: isDarkMode ? 'text-gray-400' : 'text-gray-700',
            accent: isDarkMode ? 'text-blue-500' : 'text-[#d6dfff]',
            muted: isDarkMode ? 'text-gray-500' : 'text-gray-500',
            groupHover: isDarkMode ? 'group-hover:text-blue-500' : 'group-hover:text-[#676adc]',
            hover: isDarkMode ? 'hover:text-blue-500' : 'hover:text-[#676adc]',
            other_accent: isDarkMode ? 'text-blue-500' : 'text-[#676adc]',
            include: isDarkMode ? 'text-green-400' : 'text-green-700',
            exclude: isDarkMode ? 'text-red-400' : 'text-red-600',
        },

        // Border colors
        border: {
            primary: isDarkMode ? 'border-gray-700' : 'border-gray-400',
            secondary: isDarkMode ? 'border-gray-600' : 'border-gray-400',
            accent: isDarkMode ? 'border-blue-400' : 'border-indigo-400',
            hover: isDarkMode ? 'hover:border-blue-600' : 'hover:border-indigo-500',
            groupHover: isDarkMode ? 'group-hover:border-blue-600' : 'group-hover:border-indigo-500',
            focus: isDarkMode ? 'focus:border-blue-400' : 'focus:border-indigo-400',
        },

        // Button styles
        button: {
            primary: isDarkMode
                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800'
                : 'bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-300',
            secondary: isDarkMode
                ? 'border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white'
                : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
            ghost: isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            browseAll: isDarkMode ? "bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800" : "bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400"
        },

        // Shadow styles
        shadow: {
            card: isDarkMode ? 'shadow-2xl shadow-black/20' : 'shadow-lg shadow-gray-200',
            button: isDarkMode ? 'shadow-2xl hover:shadow-blue-500/25' : 'shadow-lg hover:shadow-indigo-300/25',
        },

        //Main Background colors
        background: {
            primary: isDarkMode ? '#080731' : '#A3B3FF',
        },

        randomDiscoveryButton: {
            primary: isDarkMode ? "bg-gradient-to-br from-gray-700 to-gray-900" : "bg-gradient-to-br from-indigo-50 to-indigo-200",
        },

        card: {
            primary: isDarkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-indigo-300 to-indigo-100",
            secondary: isDarkMode ? "bg-gradient-to-br from-gray-700 to-gray-600" : "bg-gradient-to-br from-indigo-100 to-indigo-50",
            hover: isDarkMode ? "hover:from-gray-800 hover:to-gray-700" : "hover:from-indigo-200 hover:to-indigo-100",
            blur: isDarkMode ? "bg-gray-900/50 backdrop-blur-sm" : "bg-gray-900/50 backdrop-blur-sm",
            selected: isDarkMode ? 'bg-blue-800 text-white shadow-lg transition-all duration-300' : 'bg-indigo-400 text-white shadow-lg transition-all duration-300',
            indicator: isDarkMode ? "bg-gradient-to-r from-blue-600 to-blue-400" : "bg-gradient-to-r from-indigo-500 to-indigo-300"
        }
    };

    const value = {
        isDarkMode,
        toggleTheme,
        theme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
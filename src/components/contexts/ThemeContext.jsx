// contexts/ThemeContext.jsx
// Single source of truth for the design tokens (see DESIGN_SYSTEM.md §2).
// The tokens live as CSS variables in index.css; this context drives the
// `html.dark` / `html.light` class and exposes the raw values for the rare
// case a component needs them in JS.
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const TOKENS = {
    dark: {
        bg: '#0a0907',
        bg2: '#100e0b',
        paper: '#15120e',
        ink: '#ece6d6',
        ink2: '#9a9183',
        ink3: '#5a5346',
        rule: 'rgba(236,230,214,0.18)',
        ruleSoft: 'rgba(236,230,214,0.08)',
        hairline: 'rgba(236,230,214,0.14)',
        accent: '#c8965a',
        accent2: '#d8a878',
        accentSoft: 'rgba(200,150,90,0.16)',
    },
    light: {
        bg: '#f3efe5',
        bg2: '#ebe6d8',
        paper: '#ede8db',
        ink: '#1a1612',
        ink2: '#6b6457',
        ink3: '#a39a8a',
        rule: 'rgba(26,22,18,0.20)',
        ruleSoft: 'rgba(26,22,18,0.08)',
        hairline: 'rgba(26,22,18,0.14)',
        accent: '#8b5a1f',
        accent2: '#a5722f',
        accentSoft: 'rgba(139,90,31,0.14)',
    },
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage for saved preference, default to dark
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    // Update localStorage and html class when theme changes
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const theme = isDarkMode ? TOKENS.dark : TOKENS.light;

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

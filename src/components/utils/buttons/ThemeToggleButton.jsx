import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const ThemeToggleButton = ({ className = '' }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    const ink3 = isDarkMode ? '#5a5346' : '#a39a8a';
    const ink  = isDarkMode ? '#ece6d6' : '#1a1612';
    const rule = isDarkMode ? 'rgba(236,230,214,0.18)' : 'rgba(26,22,18,0.20)';

    return (
        <button
            onClick={toggleTheme}
            className={className}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            style={{
                width: 32, height: 32,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${rule}`, background: 'transparent',
                cursor: 'pointer', color: ink3,
                transition: 'color .25s, border-color .25s',
                flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = ink; e.currentTarget.style.borderColor = ink; }}
            onMouseLeave={e => { e.currentTarget.style.color = ink3; e.currentTarget.style.borderColor = rule; }}
        >
            <div style={{ position: 'relative', width: 14, height: 14 }}>
                {/* Sun */}
                <svg
                    style={{
                        position: 'absolute', inset: 0, width: 14, height: 14,
                        transition: 'opacity .3s, transform .3s',
                        opacity: isDarkMode ? 0 : 1,
                        transform: isDarkMode ? 'rotate(90deg) scale(0)' : 'rotate(0) scale(1)',
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="5" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                {/* Moon */}
                <svg
                    style={{
                        position: 'absolute', inset: 0, width: 14, height: 14,
                        transition: 'opacity .3s, transform .3s',
                        opacity: isDarkMode ? 1 : 0,
                        transform: isDarkMode ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0)',
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </div>
        </button>
    );
};

export default ThemeToggleButton;

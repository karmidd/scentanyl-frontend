import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function Footer() {
    const { isDarkMode } = useTheme();
    const ink3  = isDarkMode ? '#5a5346' : '#a39a8a';
    const accent = isDarkMode ? '#c8965a' : '#8b5a1f';
    const rule  = isDarkMode ? 'rgba(236,230,214,0.18)' : 'rgba(26,22,18,0.20)';

    return (
        <>
            <style>{`
                .sl-ftr * { box-sizing: border-box; }
                .sl-ftr-a {
                    font-family: 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 9px; letter-spacing: .28em; text-transform: uppercase;
                    color: ${ink3}; text-decoration: none;
                    transition: color .25s;
                }
                .sl-ftr-a:hover { color: ${accent}; }
            `}</style>
            <footer
                className="sl-ftr"
                style={{
                    borderTop: `1px solid ${rule}`,
                    padding: '28px 32px',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: 20, flexWrap: 'wrap',
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase',
                    color: ink3,
                }}
            >
                <div>© {new Date().getFullYear()} Scentanyl</div>
                <div style={{ display: 'flex', gap: 28 }}>
                    <Link to="/about"          className="sl-ftr-a">About</Link>
                    <Link to="/contact"        className="sl-ftr-a">Contact</Link>
                    <Link to="/privacy-policy" className="sl-ftr-a">Privacy</Link>
                </div>
            </footer>
        </>
    );
}

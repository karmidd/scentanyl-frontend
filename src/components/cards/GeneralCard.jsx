import React from 'react';
import { useTheme } from "../contexts/ThemeContext.jsx";
import { Link } from "react-router-dom";

const GeneralCard = ({ name, total, message, onClick, href }) => {
    const { isDarkMode } = useTheme();

    const ink        = isDarkMode ? '#ece6d6' : '#1a1612';
    const ink3       = isDarkMode ? '#5a5346' : '#a39a8a';
    const accent     = isDarkMode ? '#c8965a' : '#8b5a1f';
    const paper      = isDarkMode ? '#15120e' : '#ede8db';
    const rule       = isDarkMode ? 'rgba(236,230,214,0.18)' : 'rgba(26,22,18,0.20)';
    const ruleSoft   = isDarkMode ? 'rgba(236,230,214,0.08)' : 'rgba(26,22,18,0.08)';

    const handleClick = (e) => {
        if (e.button === 1) return;
        if (e.button === 0 && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (href) window.open(href, '_blank'); }
        else if (e.button === 0) { e.preventDefault(); if (onClick) onClick(); }
    };

    return (
        <div
            style={{ background: paper, border: `1px solid ${rule}`, padding: '22px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color .3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = rule; }}
        >
            <Link to={href || '#'} onMouseDown={handleClick} onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
                <h3 style={{ fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic', fontWeight: 400, fontSize: 22, lineHeight: 1.12, color: ink, margin: 0, textTransform: 'capitalize' }}>
                    {name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic', fontSize: 36, color: accent, lineHeight: 1 }}>
                        {total}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: ink3 }}>
                        total
                    </span>
                </div>

                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 8, letterSpacing: '.18em', textTransform: 'uppercase', color: ink3, textAlign: 'center', borderTop: `1px solid ${ruleSoft}`, paddingTop: 10 }}>
                    {message || 'Explore →'}
                </div>
            </Link>
        </div>
    );
};

export default GeneralCard;

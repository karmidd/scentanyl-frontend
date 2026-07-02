import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function FragranceCard({ fragrance }) {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const ink        = isDarkMode ? '#ece6d6' : '#1a1612';
    const ink2       = isDarkMode ? '#9a9183' : '#6b6457';
    const ink3       = isDarkMode ? '#5a5346' : '#a39a8a';
    const accent     = isDarkMode ? '#c8965a' : '#8b5a1f';
    const paper      = isDarkMode ? '#15120e' : '#ede8db';
    const rule       = isDarkMode ? 'rgba(236,230,214,0.18)' : 'rgba(26,22,18,0.20)';
    const ruleSoft   = isDarkMode ? 'rgba(236,230,214,0.08)' : 'rgba(26,22,18,0.08)';
    const accentSoft = isDarkMode ? 'rgba(200,150,90,0.16)' : 'rgba(139,90,31,0.14)';

    const url = `/fragrances/${encodeURIComponent(fragrance.brand)}/${encodeURIComponent(fragrance.name)}/${fragrance.id}`;

    const handleMouseDown = (e) => {
        if (e.button === 1) return;
        if (e.button === 0 && (e.ctrlKey || e.metaKey)) { e.preventDefault(); window.open(url, '_blank'); }
        else if (e.button === 0) { e.preventDefault(); navigate(url); }
    };

    const genderColor = fragrance.gender === 'men' ? '#5a78a0'
        : fragrance.gender === 'women' ? '#a05a72'
        : accent;

    return (
        <div
            className="sl-fc"
            style={{ background: paper, border: `1px solid ${rule}`, padding: '22px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.background = `color-mix(in srgb, ${paper} 85%, ${accentSoft})`; }}
            onMouseLeave={e => { e.currentTarget.style.background = paper; }}
        >
            <Link to={url} onMouseDown={handleMouseDown} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 8, letterSpacing: '.22em', textTransform: 'uppercase', color: genderColor, border: `1px solid ${genderColor}`, padding: '3px 8px' }}>
                        {fragrance.gender}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 9, letterSpacing: '.18em', color: ink3 }}>
                        {fragrance.year}
                    </span>
                </div>

                <h3 style={{ fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic', fontWeight: 400, fontSize: 20, lineHeight: 1.15, color: ink, margin: 0 }}>
                    {fragrance.name}
                </h3>

                <p style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: ink2, margin: 0 }}>
                    {fragrance.brand}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${ruleSoft}`, paddingTop: 10, marginTop: 2 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 8, letterSpacing: '.18em', textTransform: 'uppercase', color: ink3 }}>
                        Explore
                    </span>
                    <svg style={{ color: accent, width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </Link>
        </div>
    );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function BrandCard({ brand }) {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const ink        = isDarkMode ? '#ece6d6' : '#1a1612';
    const ink2       = isDarkMode ? '#9a9183' : '#6b6457';
    const ink3       = isDarkMode ? '#5a5346' : '#a39a8a';
    const accent     = isDarkMode ? '#c8965a' : '#8b5a1f';
    const paper      = isDarkMode ? '#15120e' : '#ede8db';
    const rule       = isDarkMode ? 'rgba(236,230,214,0.18)' : 'rgba(26,22,18,0.20)';
    const ruleSoft   = isDarkMode ? 'rgba(236,230,214,0.08)' : 'rgba(26,22,18,0.08)';

    const url = `/brands/${encodeURIComponent(brand.name)}`;

    const handleMouseDown = (e) => {
        if (e.button === 1) return;
        if (e.button === 0 && (e.ctrlKey || e.metaKey)) { e.preventDefault(); window.open(url, '_blank'); }
        else if (e.button === 0) { e.preventDefault(); navigate(url); }
    };

    return (
        <div
            style={{ background: paper, border: `1px solid ${rule}`, padding: '22px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', transition: 'border-color .3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = rule; }}
        >
            <Link to={url} onMouseDown={handleMouseDown} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
                <h3 style={{ fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic', fontWeight: 400, fontSize: 22, lineHeight: 1.12, color: ink, margin: 0, textAlign: 'center' }}>
                    {brand.name}
                </h3>

                {brand.totalFragrances != null && (
                    <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',ui-monospace,monospace" }}>
                        <span style={{ fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic', fontSize: 32, color: accent, lineHeight: 1 }}>
                            {brand.totalFragrances}
                        </span>
                        <span style={{ display: 'block', fontSize: 8, letterSpacing: '.24em', textTransform: 'uppercase', color: ink3, marginTop: 4 }}>
                            {brand.totalFragrances === 1 ? 'fragrance' : 'fragrances'}
                        </span>
                    </div>
                )}

                {brand.country && (
                    <p style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: ink2, margin: 0, textAlign: 'center' }}>
                        {brand.country}
                    </p>
                )}

                <div style={{ borderTop: `1px solid ${ruleSoft}`, paddingTop: 10, marginTop: 2, textAlign: 'center', fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 8, letterSpacing: '.18em', textTransform: 'uppercase', color: ink3 }}>
                    Explore fragrances →
                </div>
            </Link>
        </div>
    );
}

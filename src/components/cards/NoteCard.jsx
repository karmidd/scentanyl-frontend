import React from "react";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { Link } from "react-router-dom";

const NoteCard = ({ note, noteData, onClick, href }) => {
    const { totalFragrances, topNotes, middleNotes, baseNotes, uncategorizedNotes } = noteData;
    const { isDarkMode } = useTheme();

    const ink        = isDarkMode ? '#ece6d6' : '#1a1612';
    const ink2       = isDarkMode ? '#9a9183' : '#6b6457';
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

    const row = (label, val) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ color: ink3 }}>{label}</span>
            <span style={{ color: accent, fontStyle: 'italic', fontFamily: "'Playfair Display','Georgia',serif", fontSize: 15 }}>{val}</span>
        </div>
    );

    return (
        <div
            style={{ background: paper, border: `1px solid ${rule}`, padding: '22px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color .3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = rule; }}
        >
            <Link to={href || '#'} onMouseDown={handleClick} onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: ink, margin: 0, textTransform: 'capitalize' }}>
                        {note}
                    </h3>
                    <span style={{ fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic', fontSize: 28, color: accent, lineHeight: 1 }}>
                        {totalFragrances}
                    </span>
                </div>

                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${ruleSoft}`, paddingTop: 12 }}>
                    {row('Top', topNotes)}
                    {row('Middle', middleNotes)}
                    {row('Base', baseNotes)}
                    {row('Uncat.', uncategorizedNotes)}
                </div>

                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 8, letterSpacing: '.18em', textTransform: 'uppercase', color: ink3, textAlign: 'center', borderTop: `1px solid ${ruleSoft}`, paddingTop: 10 }}>
                    Explore →
                </div>
            </Link>
        </div>
    );
};

export default NoteCard;

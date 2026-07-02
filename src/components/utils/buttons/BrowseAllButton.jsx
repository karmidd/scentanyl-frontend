import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export default function BrowseAllButton() {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const ink    = isDarkMode ? '#ece6d6' : '#1a1612';
    const accent = isDarkMode ? '#c8965a' : '#8b5a1f';
    const paper  = isDarkMode ? '#0a0907' : '#f3efe5';

    return (
        <button
            onClick={() => navigate('/fragrances')}
            style={{
                fontFamily: "'JetBrains Mono',ui-monospace,monospace",
                fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase',
                padding: '13px 22px', border: `1px solid ${ink}`,
                background: ink, color: paper, cursor: 'pointer',
                transition: 'background .25s, border-color .25s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.borderColor = accent; }}
            onMouseLeave={e => { e.currentTarget.style.background = ink; e.currentTarget.style.borderColor = ink; }}
        >
            <svg style={{ width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse All
        </button>
    );
}

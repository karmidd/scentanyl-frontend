import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { apiFetch } from '../utils/apiFetch.jsx';

const LINKS = [
    { label: 'Fragrances', href: '/fragrances', page: 1 },
    { label: 'Brands', href: '/brands', page: 2 },
    { label: 'Notes', href: '/notes', page: 3 },
    { label: 'Accords', href: '/accords', page: 4 },
    { label: 'Perfumers', href: '/perfumers', page: 5 },
    { label: 'Salon', href: '/salon', page: 6, accent: true },
];

/**
 * Sticky blurred nav (DESIGN_SYSTEM.md §5): brand wordmark · centered mono
 * links · right utilities (Search, Random, theme toggle).
 * `page` matches the old headerNum contract (0 = home).
 */
export default function Nav({ page = 0 }) {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const goRandom = async () => {
        setOpen(false);
        try {
            const response = await apiFetch(`${API_BASE_URL}/api/random-frag`);
            const fragrance = await response.json();
            navigate(`/fragrances/${encodeURIComponent(fragrance.brand)}/${encodeURIComponent(fragrance.name)}/${fragrance.id}`);
        } catch (error) {
            console.error('Error fetching random fragrance:', error);
        }
    };

    const linkClass = (l) => {
        const classes = [];
        if (l.page === page) classes.push('on');
        else if (l.accent) classes.push('accent');
        return classes.join(' ') || undefined;
    };

    return (
        <nav className={`top${open ? ' open' : ''}`}>
            <div>
                <Link to="/" className="brand" onClick={() => setOpen(false)}>Scentanyl<em>.</em></Link>
            </div>
            <div className="links">
                {LINKS.map(l => (
                    <Link key={l.href} to={l.href} className={linkClass(l)}>{l.label}</Link>
                ))}
            </div>
            <div className="util">
                <button type="button" className="menu-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
                    {open ? '✕ Close' : '☰ Menu'}
                </button>
                <Link to="/fragrances" className="icon">Search</Link>
                <button type="button" className="icon" onClick={goRandom}>Random</button>
                <button type="button" className="icon" onClick={toggleTheme}>
                    {isDarkMode ? '◐ Light' : '◑ Dark'}
                </button>
            </div>
            <div className="sheet">
                {LINKS.map(l => (
                    <Link key={l.href} to={l.href} className={linkClass(l)} onClick={() => setOpen(false)}>
                        {l.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

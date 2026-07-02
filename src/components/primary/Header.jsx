import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggleButton from "../utils/buttons/ThemeToggleButton.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";

const NAV_ITEMS = [
    { label: "Home",       href: "/" },
    { label: "Fragrances", href: "/fragrances" },
    { label: "Brands",     href: "/brands" },
    { label: "Notes",      href: "/notes" },
    { label: "Accords",    href: "/accords" },
    { label: "Perfumers",  href: "/perfumers" },
];

export default function Header({ page }) {
    const { isDarkMode } = useTheme();
    const [scrolled, setScrolled]     = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const ink    = isDarkMode ? '#ece6d6' : '#1a1612';
    const ink3   = isDarkMode ? '#5a5346' : '#a39a8a';
    const accent = isDarkMode ? '#c8965a' : '#8b5a1f';
    const rule   = isDarkMode ? 'rgba(236,230,214,0.18)' : 'rgba(26,22,18,0.20)';
    const bgScrolled = isDarkMode ? 'rgba(10,9,7,0.92)' : 'rgba(243,239,229,0.92)';
    const mobHover   = isDarkMode ? 'rgba(236,230,214,0.06)' : 'rgba(26,22,18,0.04)';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const close = (e) => {
            if (mobileOpen && !e.target.closest('.sl-mob-wrap')) setMobileOpen(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [mobileOpen]);

    return (
        <>
            <style>{`
                .sl-hdr *, .sl-hdr *::before, .sl-hdr *::after { box-sizing: border-box; }
                .sl-logo {
                    font-family: 'Playfair Display','Georgia',serif;
                    font-style: italic; font-weight: 400;
                    font-size: 22px; letter-spacing: -.02em;
                    color: ${ink}; text-decoration: none;
                    transition: opacity .2s;
                }
                .sl-logo:hover { opacity: .7; }
                .sl-logo-dot { color: ${accent}; font-style: normal; }
                .sl-nav {
                    display: flex; gap: 28px; align-items: center;
                }
                .sl-nav-a {
                    font-family: 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 9px; letter-spacing: .28em; text-transform: uppercase;
                    color: ${ink3}; text-decoration: none;
                    position: relative; padding-bottom: 3px;
                    transition: color .25s;
                    white-space: nowrap;
                }
                .sl-nav-a:hover { color: ${ink}; }
                .sl-nav-a.on   { color: ${ink}; }
                .sl-nav-a.on::after {
                    content: ''; position: absolute;
                    left: 0; right: 0; bottom: -2px;
                    height: 1px; background: ${accent};
                }
                .sl-mob-btn {
                    font-family: 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
                    color: ${ink3}; background: none;
                    border: 1px solid ${rule};
                    padding: 7px 14px; cursor: pointer;
                    transition: color .25s, border-color .25s;
                }
                .sl-mob-btn:hover { color: ${ink}; border-color: ${ink}; }
                .sl-mob-drop {
                    position: absolute; top: calc(100% + 6px); right: 0;
                    background: ${isDarkMode ? 'rgba(10,9,7,0.97)' : 'rgba(243,239,229,0.97)'};
                    border: 1px solid ${rule};
                    min-width: 180px; z-index: 100;
                    backdrop-filter: blur(16px);
                }
                .sl-mob-a {
                    display: block;
                    font-family: 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 9px; letter-spacing: .28em; text-transform: uppercase;
                    color: ${ink3}; text-decoration: none;
                    padding: 12px 20px; transition: color .2s, background .2s;
                }
                .sl-mob-a:hover  { color: ${ink}; background: ${mobHover}; }
                .sl-mob-a.on     { color: ${accent}; }
                @media (max-width: 640px)  { .sl-nav { display: none; } .sl-mob-wrap { display: block !important; } }
                @media (min-width: 641px)  { .sl-mob-wrap { display: none !important; } }
            `}</style>

            <header
                className="sl-hdr"
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
                    background:    scrolled ? bgScrolled : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    borderBottom: `1px solid ${scrolled ? rule : 'transparent'}`,
                    transition: 'background .3s, border-color .3s, backdrop-filter .3s',
                }}
            >
                <div style={{
                    maxWidth: 1480, margin: '0 auto',
                    padding: '0 32px', height: 72,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 24,
                }}>
                    {/* Logo */}
                    <Link to="/" className="sl-logo">
                        Scentanyl<span className="sl-logo-dot">.</span>
                    </Link>

                    {/* Desktop nav — hidden on mobile via CSS */}
                    <nav className="sl-nav">
                        {NAV_ITEMS.map((item, i) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`sl-nav-a${i === page ? ' on' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        <ThemeToggleButton />

                        {/* Mobile menu — shown on mobile via CSS */}
                        <div className="sl-mob-wrap" style={{ position: 'relative', display: 'none' }}>
                            <button
                                className="sl-mob-btn"
                                onClick={() => setMobileOpen(v => !v)}
                                aria-label="Toggle navigation"
                            >
                                {mobileOpen ? '✕ Close' : '≡ Menu'}
                            </button>
                            {mobileOpen && (
                                <div className="sl-mob-drop">
                                    {NAV_ITEMS.map((item, i) => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={`sl-mob-a${i === page ? ' on' : ''}`}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

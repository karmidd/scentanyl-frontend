import React from "react";
import { useTheme } from "../contexts/ThemeContext";

// Seamlessly tiling fractal noise — renders as paper/linen grain when overlaid
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Background() {
    const { isDarkMode } = useTheme();
    const base     = isDarkMode ? '#0a0907' : '#f3efe5';
    const vignette = isDarkMode
        ? 'radial-gradient(ellipse at 50% 38%, transparent 42%, rgba(0,0,0,0.55) 100%)'
        : 'radial-gradient(ellipse at 50% 38%, transparent 42%, rgba(26,22,18,0.13) 100%)';

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundColor: base, transition: 'background-color 0.6s' }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: GRAIN,
                backgroundRepeat: 'repeat',
                backgroundSize: '256px 256px',
                mixBlendMode: 'overlay',
                opacity: 0.065,
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: vignette,
                pointerEvents: 'none',
            }} />
        </div>
    );
}

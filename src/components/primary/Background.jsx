import React from 'react';
import './Background.css';

/**
 * The site background (DESIGN_SYSTEM.md §8).
 *
 * One fixed layer, entirely GPU-composited:
 *  - three large, very soft radial "light pools" drifting via transform only
 *    (compositor thread — no layout, no repaint, no per-frame JS)
 *  - a static top "spotlight" glow
 *  - an edge vignette
 * Softness comes from radial-gradient, never filter:blur.
 * Freezes under prefers-reduced-motion (CSS) or via the `frozen` prop.
 * Render once near the app root; app content sits above at z-index 1+.
 */
export default function Background({ frozen = false }) {
    return (
        <div className={`sc-bg${frozen ? ' frozen' : ''}`} aria-hidden="true">
            <div className="sc-bg-spot" />
            <div className="sc-bg-pools">
                <div className="sc-pool p1" />
                <div className="sc-pool p2" />
                <div className="sc-pool p3" />
            </div>
            <div className="sc-bg-vignette" />
        </div>
    );
}

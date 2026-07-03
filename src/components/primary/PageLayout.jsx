import React from 'react';
import Background from './Background.jsx';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';

/**
 * Shared page shell: background + grain/vignette overlays + nav + footer.
 * `headerNum` keeps the old contract (0 home · 1 fragrances · 2 brands ·
 * 3 notes · 4 accords · 5 perfumers · 6 salon).
 * `fullBleed` lets a page manage its own .stage sections (Home, Salon).
 */
export default function PageLayout({ headerNum = 0, children, style, fullBleed = false }) {
    return (
        <>
            <Background />
            <div className="grain" aria-hidden="true" />
            <div className="vignette" aria-hidden="true" />
            <Nav page={headerNum} />
            <main style={{ position: 'relative', zIndex: 2 }}>
                {fullBleed ? children : <div className="stage">{children}</div>}
            </main>
            {style}
            <Footer />
        </>
    );
}

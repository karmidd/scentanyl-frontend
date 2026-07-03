import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NotePyramid.css';

/**
 * The notes pyramid as stacked horizontal tiers (DESIGN_SYSTEM.md §6.2):
 * Top → Heart → Base (+ uncategorized). Each tier's accent rule draws down
 * and its note chips rise in when scrolled into view. The heart tier is
 * amber-tinted. Notes link to /notes/:name.
 *
 * tiers: [{ key, kicker, name, desc, notes: [], heart? }]
 */
export default function NotePyramid({ tiers }) {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;
        const els = root.querySelectorAll('[data-tier]');
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce || typeof IntersectionObserver === 'undefined') {
            els.forEach(el => el.classList.add('in'));
            return undefined;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const notes = e.target.querySelectorAll('.note');
                    notes.forEach((n, i) => { n.style.transitionDelay = `${i * 70}ms`; });
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: .3 });
        els.forEach(el => io.observe(el));
        return () => io.disconnect();
    }, [tiers]);

    if (!tiers.length) return null;

    return (
        <section className="pyramid" ref={rootRef}>
            <div className="pyr-head">
                <span className="t">The pyramid</span>
                <span className="sub">— read top to base —</span>
            </div>
            {tiers.map(tier => (
                <div key={tier.key} className={`tier${tier.heart ? ' heart' : ''}`} data-tier>
                    <div className="label">
                        <div className="ti">{tier.kicker}</div>
                        <div className="tn">{tier.name}</div>
                        {tier.desc && <div className="desc">{tier.desc}</div>}
                    </div>
                    <div className="notes">
                        {tier.notes.map((note, i) => (
                            <Link key={i} className="note" to={`/notes/${encodeURIComponent(note)}`}>
                                {note}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

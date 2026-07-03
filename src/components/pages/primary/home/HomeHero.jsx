import React from 'react';

const season = () => {
    const m = new Date().getMonth();
    return (m >= 2 && m <= 7) ? 'Spring / Summer' : 'Autumn / Winter';
};

/** Home masthead: issue line, the two-line motto, lede + tonight's specimen. */
export default function HomeHero({ fragranceCount, specimen }) {
    return (
        <section className="hm-hero">
            <div className="issue">
                <span>Vol. I — № 001</span>
                {fragranceCount > 0 && <span>{fragranceCount.toLocaleString()} fragrances in the archive</span>}
                <span>{season()} {new Date().getFullYear()}</span>
            </div>

            <h1>
                <span className="l1">Get addicted.</span>
                <span className="l2">Then write it down.</span>
            </h1>

            <div className="below">
                <p className="lede">
                    A working archive of the world's most considered perfumery — <strong>collected</strong>,
                    indexed, and presented without hurry. Begin anywhere; you will not finish.
                </p>
                {specimen && (
                    <div className="meta-right">
                        <b>Tonight's specimen</b>
                        {specimen.brand} · {specimen.name}<br />
                        — selected at random
                    </div>
                )}
            </div>

            <div className="tagline-strip">
                <span>— for the considered nose</span>
                <span className="pill accent">search the archive</span>
                <span><span className="accent">indexing in progress</span></span>
            </div>
        </section>
    );
}

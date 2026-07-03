import React, { useMemo } from 'react';

const DROPLETS = 22;

/**
 * The spritz loader (DESIGN_SYSTEM.md §6): the italic wordmark blurs into
 * focus while amber droplets fan out radially, then the tagline fades in.
 * Shown while a page's data is loading; unmounts when it resolves.
 */
export default function LoadingPage() {
    const droplets = useMemo(() =>
        Array.from({ length: DROPLETS }, (_, i) => {
            const ang = (Math.PI * 2 * i / DROPLETS) + (Math.random() * .2 - .1);
            const dist = 90 + Math.random() * 90;
            return {
                tx: `calc(-50% + ${Math.cos(ang) * dist}px)`,
                ty: `calc(-50% + ${Math.sin(ang) * dist}px)`,
                delay: `${(0.05 + Math.random() * 0.3).toFixed(2)}s`,
                size: `${(2 + Math.random() * 3).toFixed(1)}px`,
            };
        }), []);

    return (
        <div className="loader" role="status" aria-label="Loading">
            <div className="spritz">
                <div className="nozzle">Scentanyl<em>.</em></div>
                <div className="tag">A working archive of considered perfumery</div>
                {droplets.map((d, i) => (
                    <div
                        key={i}
                        className="droplet"
                        style={{
                            '--tx': d.tx,
                            '--ty': d.ty,
                            animationDelay: d.delay,
                            width: d.size,
                            height: d.size,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

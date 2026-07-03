import React from 'react';
import './StatsBand.css';

/**
 * Detail-page figures as a hairline band: big Bodoni-italic number over a
 * mono label per cell (replaces the old colored stat cards).
 * items: [{ value, label, accent? }]
 */
export default function StatsBand({ items }) {
    const cells = items.filter(Boolean);
    if (!cells.length) return null;
    return (
        <div className="stats-band">
            {cells.map((item, i) => (
                <div className="cell" key={i}>
                    <b className={item.accent ? 'accent' : ''}>{Number(item.value).toLocaleString()}</b>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
}

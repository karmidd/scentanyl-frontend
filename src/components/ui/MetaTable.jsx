import React from 'react';

/**
 * Detail-page spec sheet: [mono key | Bodoni-italic value] rows divided by
 * hairlines. rows: [{ k, v }] where v is any node (links hover to amber).
 */
export default function MetaTable({ rows }) {
    return (
        <div className="meta-table">
            {rows.filter(Boolean).map((row, i) => (
                <div className="row" key={i}>
                    <span className="k">{row.k}</span>
                    <span className="v">{row.v}</span>
                </div>
            ))}
        </div>
    );
}

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Mono uppercase breadcrumb, `/`-separated, current item in accent.
 * items: [{ label, to? }] — the last item (or any without `to`) is rendered
 * as the current location.
 */
export default function Breadcrumb({ items, style }) {
    return (
        <div className="crumb" style={style}>
            {items.map((item, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <span className="sep">/</span>}
                    {item.to && i < items.length - 1
                        ? <Link to={item.to}>{item.label}</Link>
                        : <span className="here">{item.label}</span>}
                </React.Fragment>
            ))}
        </div>
    );
}

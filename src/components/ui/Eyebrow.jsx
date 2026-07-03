import React from 'react';

/** Mono section eyebrow: `— Label` with an optional right-aligned counterpart. */
export default function Eyebrow({ children, right, style }) {
    return (
        <div className="pre" style={style}>
            <span>— {children}</span>
            {right != null && <span>{right}</span>}
        </div>
    );
}

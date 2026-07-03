import React from 'react';

/** Quiet serif empty state with a mono hint. */
export default function EmptyState({ big, small }) {
    return (
        <div className="empty">
            <div className="big">{big}</div>
            {small && <div className="small">{small}</div>}
        </div>
    );
}

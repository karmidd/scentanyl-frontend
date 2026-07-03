import React from 'react';

/** Centered load-more control with an optional mono note. */
export default function LoadMoreRow({ onClick, disabled, label = '↓ Load more', note }) {
    return (
        <div className="load-row">
            <button type="button" className="load-btn" onClick={onClick} disabled={disabled}>
                {label}
            </button>
            {note && <span className="load-note">{note}</span>}
        </div>
    );
}

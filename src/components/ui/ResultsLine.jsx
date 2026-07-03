import React from 'react';

/** "Showing N of M things" line under the filter bar. */
export default function ResultsLine({ shown, total, type = 'entries', right }) {
    return (
        <div className="results-line">
            <span>
                Showing <b>{Number(shown).toLocaleString()}</b> of {Number(total).toLocaleString()} {type}
            </span>
            {right != null && <span>{right}</span>}
        </div>
    );
}

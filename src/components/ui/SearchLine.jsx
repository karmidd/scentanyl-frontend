import React from 'react';

/**
 * The archive search line: hairline-bounded serif-italic input with a quiet
 * mono glyph. Controlled component; submit is a no-op (search is live).
 */
export default function SearchLine({ value, onChange, placeholder, onSubmit }) {
    return (
        <form
            className="search-line"
            role="search"
            onSubmit={onSubmit || ((e) => e.preventDefault())}
        >
            <span className="ic" aria-hidden="true">⌕</span>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                aria-label={placeholder}
            />
        </form>
    );
}

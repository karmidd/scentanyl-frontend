import React, { useState, useRef, useEffect } from 'react';
import './FilterSelect.css';

/**
 * Quiet mono dropdown filter (e.g. Country / Parent house on the brands
 * index). Options are plain strings; '' clears the filter.
 */
export default function FilterSelect({ label, value, options, onChange, allLabel }) {
    const [open, setOpen] = useState(false);
    const [term, setTerm] = useState('');
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onDocClick = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false);
                setTerm('');
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [open]);

    const filtered = term
        ? options.filter(o => o.toLowerCase().includes(term.toLowerCase())).slice(0, 30)
        : options.slice(0, 30);

    const pick = (v) => {
        onChange(v);
        setOpen(false);
        setTerm('');
    };

    return (
        <div className="fselect" ref={rootRef}>
            <button
                type="button"
                className={`fselect-btn${value ? ' set' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
            >
                {label} · {value || 'all'} <span className="caret">{open ? '▴' : '▾'}</span>
            </button>
            {open && (
                <div className="fselect-panel">
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder={`Find within ${options.length.toLocaleString()}…`}
                        autoFocus
                    />
                    <div className="fselect-list">
                        <button type="button" onClick={() => pick('')}>{allLabel || `All`}</button>
                        {filtered.map(o => (
                            <button key={o} type="button" className={o === value ? 'on' : ''} onClick={() => pick(o)}>
                                {o}
                            </button>
                        ))}
                        {filtered.length === 0 && <div className="none">nothing matches</div>}
                    </div>
                </div>
            )}
        </div>
    );
}

import React from 'react';

/**
 * Mono segmented control.
 * options: [{ value, label, count? }]
 */
export default function Seg({ options, value, onChange }) {
    return (
        <div className="seg" role="group">
            {options.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    className={value === opt.value ? 'on' : ''}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                    {opt.count != null && <span className="ct">{opt.count}</span>}
                </button>
            ))}
        </div>
    );
}

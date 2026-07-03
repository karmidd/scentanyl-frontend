import React from 'react';

/**
 * The quiet gender indicator: a tiny glyph + mono label, never a colored badge.
 * ■ men · ● women · ◐ unisex (drawn in CSS via .gmark::before).
 */
export default function GenderMark({ gender }) {
    const g = String(gender || '').toLowerCase();
    const known = g === 'men' || g === 'women' || g === 'unisex';
    return <span className={`gmark${known ? ` ${g}` : ''}`}>{gender}</span>;
}

import React from 'react';

/**
 * The signature type habit: a name with its last word set in italic
 * (e.g. "Tobacco <em>Vanille</em>"). Single-word names render as-is.
 */
export default function ItalicName({ text }) {
    if (!text) return null;
    const words = String(text).trim().split(/\s+/);
    if (words.length < 2) return <>{text}</>;
    const last = words.pop();
    return (
        <>
            {words.join(' ')} <em>{last}</em>
        </>
    );
}

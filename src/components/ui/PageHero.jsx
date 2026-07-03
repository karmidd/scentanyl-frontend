import React from 'react';

/**
 * Page masthead: giant Didone H1 (accent-italic tail) with a right-aligned
 * mono sub block whose first line is a big Bodoni-italic figure.
 *
 * title: plain string; the words after `titleBreak` (or the last word)
 * render as the italic accent. Pass `titleItalic` to control it exactly.
 */
export default function PageHero({ title, titleItalic, sub, subLines = [] }) {
    let head = title;
    let tail = titleItalic;
    if (tail == null && title) {
        const words = String(title).trim().split(/\s+/);
        tail = words.length > 1 ? words.pop() : null;
        head = words.join(' ');
        if (tail == null) head = title;
    }
    return (
        <div className="page-hero">
            <h1>
                {head}{tail ? <> <em>{tail}</em></> : null}
            </h1>
            {(sub != null || subLines.length > 0) && (
                <div className="sub">
                    {sub != null && <b>{sub}</b>}
                    {subLines.map((line, i) => (
                        <React.Fragment key={i}>{line}{i < subLines.length - 1 && <br />}</React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}

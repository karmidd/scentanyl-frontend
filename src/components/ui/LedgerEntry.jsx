import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageSlot from './ImageSlot.jsx';

/**
 * The core repeating row (Home channels, Salon):
 * [number] [image?] [kind + italic title + excerpt + tag pills] [meta] [stats]
 *
 * kind:      { label, variant?: 'review' | 'question' | 'feature' }
 * meta:      { name, lines: [] }
 * stats:     { big, accent?, rows: [] }
 * image:     { imageUrl?, sno?, label? } — adds the 3:4 slot column
 */
export default function LedgerEntry({ num, kind, title, excerpt, tags = [], meta, stats, image, to, onClick }) {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) onClick();
        else if (to) navigate(to);
    };
    return (
        <div className={`entry${image ? ' with-img' : ''}`} onClick={handleClick}>
            <span className="num">{num}</span>
            {image && (
                <ImageSlot
                    className="spec-slot"
                    imageUrl={image.imageUrl}
                    alt={image.alt || ''}
                    ratio="3/4"
                    sno={image.sno}
                    label={image.label}
                />
            )}
            <div>
                {kind && <span className={`kind${kind.variant ? ` ${kind.variant}` : ''}`}>— {kind.label}</span>}
                <h3 className="ttl">{title}</h3>
                {excerpt && <p className="excerpt">{excerpt}</p>}
                {tags.length > 0 && (
                    <div className="tags">
                        {tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
                    </div>
                )}
            </div>
            {meta && (
                <div className="meta">
                    <b>{meta.name}</b>
                    {meta.lines?.map((line, i) => (
                        <React.Fragment key={i}>{line}{i < meta.lines.length - 1 && <br />}</React.Fragment>
                    ))}
                </div>
            )}
            {stats && (
                <div className="stats">
                    <span className={`big${stats.accent ? ' accent' : ''}`}>{stats.big}</span>
                    {stats.rows?.map((row, i) => <span key={i} className="row">{row}</span>)}
                </div>
            )}
        </div>
    );
}

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ImageSlot from './ImageSlot.jsx';
import GenderMark from './GenderMark.jsx';
import ItalicName from './ItalicName.jsx';

const parseList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value).split(',').map(s => s.trim()).filter(Boolean);
};

/**
 * Catalogue card (browse-grid unit): image slot → mono house →
 * Bodoni-italic name → accord whispers → year + gender mark.
 * The whole card navigates to the fragrance; accords stay quiet text
 * (the card is one target).
 */
export default function FragranceCatCard({ fragrance, index = 0, highlightAccords = [] }) {
    const navigate = useNavigate();
    const url = `/fragrances/${encodeURIComponent(fragrance.brand)}/${encodeURIComponent(fragrance.name)}/${fragrance.id}`;
    const accords = parseList(fragrance.accords).slice(0, 2);
    const highlights = highlightAccords.map(a => a.toLowerCase());

    return (
        <div
            className="cat-card"
            style={{ animationDelay: `${(index % 20) * 45}ms` }}
            onClick={() => navigate(url)}
        >
            <ImageSlot
                imageUrl={fragrance.imageUrl}
                alt={`${fragrance.name} by ${fragrance.brand}`}
                ratio="3/4"
                sno={fragrance.id != null ? `№ ${String(fragrance.id).padStart(4, '0')}` : undefined}
            />
            <div className="house">{fragrance.brand}</div>
            <Link to={url} className="nm" onClick={(e) => e.stopPropagation()}>
                <ItalicName text={fragrance.name} />
            </Link>
            {accords.length > 0 && (
                <div className="accords">
                    {accords.map((a, i) => (
                        <span key={i} className={`ac${highlights.includes(a.toLowerCase()) ? ' match' : ''}`}>{a}</span>
                    ))}
                </div>
            )}
            <div className="foot">
                <span>{fragrance.year || '—'}</span>
                <GenderMark gender={fragrance.gender} />
            </div>
        </div>
    );
}

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ItalicName from './ItalicName.jsx';

/**
 * Catalogue cell for index pages (brands, notes, accords, perfumers):
 * no imagery — a mono eyebrow, the Bodoni-italic name, and a mono footer
 * (e.g. fragrance count · country).
 */
export default function IndexCard({ to, eyebrow, name, footLeft, footRight, index = 0 }) {
    const navigate = useNavigate();
    return (
        <div
            className="cat-card index-card"
            style={{ animationDelay: `${(index % 24) * 40}ms` }}
            onClick={() => navigate(to)}
        >
            {eyebrow && <div className="house">{eyebrow}</div>}
            <Link to={to} className="nm" onClick={(e) => e.stopPropagation()}>
                <ItalicName text={name} />
            </Link>
            <div className="foot">
                <span>{footLeft}</span>
                {footRight != null && <span>{footRight}</span>}
            </div>
        </div>
    );
}

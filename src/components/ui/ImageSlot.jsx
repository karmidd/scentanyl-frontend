import React from 'react';

/**
 * Bottle/photo slot. Shows the hatched placeholder until a real imageUrl
 * exists, in which case the image covers the slot.
 *
 * ratio: "3/4" (cards) or "4/5" (hero specimen)
 */
export default function ImageSlot({ imageUrl, alt = '', ratio = '3/4', label, sno, className = '' }) {
    return (
        <div className={`slot ${className}`} style={{ aspectRatio: ratio.replace('/', ' / ') }}>
            {sno && <span className="sno">{sno}</span>}
            {imageUrl
                ? <img src={imageUrl} alt={alt} loading="lazy" />
                : label && <span className="slot-label">{label}</span>}
        </div>
    );
}

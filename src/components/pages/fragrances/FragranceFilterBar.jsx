import React, { useState, useEffect } from 'react';
import Seg from '../../ui/Seg.jsx';

const compact = (n) => {
    if (n == null) return undefined;
    if (n >= 1000) return `${Math.round(n / 1000)}k`;
    return String(n);
};

/**
 * The archive filter line: gender segments (with counts), year range + sort,
 * active composition chips, and the Compose button.
 * Purely presentational — all state lives in AllFragrancesPage.
 */
export default function FragranceFilterBar({
    selectedGender, onGenderChange, genderCounts,
    minYear, maxYear, yearRange, onYearRangeChange,
    yearSort, onYearSortChange,
    advancedSearchData, onAdvancedSearchChange,
    onOpenComposer,
}) {
    const [yearDraft, setYearDraft] = useState(['', '']);

    useEffect(() => {
        setYearDraft(yearRange ? [String(yearRange[0]), String(yearRange[1])] : ['', '']);
    }, [yearRange]);

    const applyYears = () => {
        const lo = parseInt(yearDraft[0], 10);
        const hi = parseInt(yearDraft[1], 10);
        if (!isNaN(lo) && !isNaN(hi) && lo <= hi) {
            onYearRangeChange([lo, hi]);
        }
    };

    const composing =
        advancedSearchData.mode !== 'regular' && (
            advancedSearchData.accords.length > 0 ||
            advancedSearchData.excludedAccords.length > 0 ||
            Object.values(advancedSearchData.notes).some(a => a.length > 0) ||
            Object.values(advancedSearchData.excludedNotes).some(a => a.length > 0)
        );

    const removeChip = (kind, layer, name) => {
        const next = {
            ...advancedSearchData,
            accords: [...advancedSearchData.accords],
            excludedAccords: [...advancedSearchData.excludedAccords],
            notes: Object.fromEntries(Object.entries(advancedSearchData.notes).map(([k, v]) => [k, [...v]])),
            excludedNotes: Object.fromEntries(Object.entries(advancedSearchData.excludedNotes).map(([k, v]) => [k, [...v]])),
        };
        if (kind === 'accord') next.accords = next.accords.filter(a => a !== name);
        if (kind === 'xaccord') next.excludedAccords = next.excludedAccords.filter(a => a !== name);
        if (kind === 'note') next.notes[layer] = next.notes[layer].filter(n => n !== name);
        if (kind === 'xnote') next.excludedNotes[layer] = next.excludedNotes[layer].filter(n => n !== name);
        onAdvancedSearchChange(next);
    };

    const chips = [];
    if (advancedSearchData.mode !== 'regular') {
        advancedSearchData.accords.forEach(a => chips.push({ kind: 'accord', name: a, inc: true }));
        advancedSearchData.excludedAccords.forEach(a => chips.push({ kind: 'xaccord', name: a, inc: false }));
        Object.entries(advancedSearchData.notes).forEach(([layer, arr]) =>
            arr.forEach(n => chips.push({ kind: 'note', layer, name: n, inc: true })));
        Object.entries(advancedSearchData.excludedNotes).forEach(([layer, arr]) =>
            arr.forEach(n => chips.push({ kind: 'xnote', layer, name: n, inc: false })));
    }

    return (
        <div className="filter-bar">
            <div className="fb-group">
                <span className="lbl">Gender</span>
                <Seg
                    value={selectedGender}
                    onChange={onGenderChange}
                    options={[
                        { value: 'all', label: 'All', count: compact(genderCounts?.all) },
                        { value: 'men', label: 'Men', count: compact(genderCounts?.men) },
                        { value: 'women', label: 'Women', count: compact(genderCounts?.women) },
                        { value: 'unisex', label: 'Unisex', count: compact(genderCounts?.unisex) },
                    ]}
                />
            </div>

            {minYear != null && maxYear != null && (
                <div className="fb-group">
                    <span className="lbl">Year</span>
                    <span className="chip">
                        <input
                            type="text" inputMode="numeric"
                            value={yearDraft[0]}
                            placeholder={String(minYear)}
                            onChange={(e) => setYearDraft([e.target.value, yearDraft[1]])}
                            onBlur={applyYears}
                            onKeyDown={(e) => e.key === 'Enter' && applyYears()}
                            aria-label="From year"
                        />
                        —
                        <input
                            type="text" inputMode="numeric"
                            value={yearDraft[1]}
                            placeholder={String(maxYear)}
                            onChange={(e) => setYearDraft([yearDraft[0], e.target.value])}
                            onBlur={applyYears}
                            onKeyDown={(e) => e.key === 'Enter' && applyYears()}
                            aria-label="To year"
                        />
                        {yearRange && (
                            <span className="x" onClick={() => onYearRangeChange(null)} role="button" aria-label="Clear year range">✕</span>
                        )}
                    </span>
                    <Seg
                        value={yearSort}
                        onChange={onYearSortChange}
                        options={[
                            { value: 'none', label: 'Relevance' },
                            { value: 'newest', label: 'Newest' },
                            { value: 'oldest', label: 'Oldest' },
                        ]}
                    />
                </div>
            )}

            {chips.length > 0 && (
                <div className="fb-group">
                    <span className="lbl">Composing</span>
                    {chips.map((c, i) => (
                        <span key={`${c.kind}-${c.layer || ''}-${c.name}-${i}`} className={`chip ${c.inc ? 'inc' : 'exc'}`}>
                            {c.name}
                            <span className="x" onClick={() => removeChip(c.kind, c.layer, c.name)} role="button" aria-label={`Remove ${c.name}`}>✕</span>
                        </span>
                    ))}
                </div>
            )}

            <button type="button" className={`adv-btn${composing ? ' solid' : ''}`} onClick={onOpenComposer}>
                ⊕ Compose your scent
            </button>
        </div>
    );
}

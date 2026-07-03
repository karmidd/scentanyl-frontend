import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch.jsx';
import './Composer.css';

const EMPTY_NOTES = { top: [], middle: [], base: [], uncategorized: [] };
const CHIP_LIMIT = 24;

const normalizeNames = (data) =>
    Array.isArray(data)
        ? data.map(item => (typeof item === 'object' && item?.name ? item.name : item))
              .filter(n => typeof n === 'string')
        : [];

/**
 * "Compose your scent" — the advanced search as a slide-out panel.
 * Emits the exact advancedSearchData contract the archive fetch expects:
 * { mode: 'regular'|'layered'|'uncategorized', accords, excludedAccords,
 *   notes: {top,middle,base,uncategorized}, excludedNotes: {...} }
 *
 * Chip interaction: tap once to include, twice to exclude, thrice to clear.
 */
export default function Composer({ open, onClose, value, onChange }) {
    const [availableNotes, setAvailableNotes] = useState([]);
    const [availableAccords, setAvailableAccords] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [finders, setFinders] = useState({});
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Fetch the vocabularies once, when the composer is first opened
    useEffect(() => {
        if (!open || fetched) return;
        setFetched(true);
        apiFetch(`${API_BASE_URL}/api/notes`)
            .then(res => res.json())
            .then(data => setAvailableNotes(normalizeNames(data)))
            .catch(err => { console.error('Error fetching notes:', err); });
        apiFetch(`${API_BASE_URL}/api/accords`)
            .then(res => res.json())
            .then(data => setAvailableAccords(normalizeNames(data)))
            .catch(err => { console.error('Error fetching accords:', err); });
    }, [open, fetched, API_BASE_URL]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const mode = value.mode === 'regular' ? 'layered' : value.mode;

    const setMode = (m) => {
        // Switching modes clears selections (as the previous advanced search did)
        onChange({
            mode: m,
            accords: [],
            excludedAccords: [],
            notes: { ...EMPTY_NOTES },
            excludedNotes: { ...EMPTY_NOTES },
        });
    };

    const clearAll = () => {
        onChange({
            mode: 'regular',
            accords: [],
            excludedAccords: [],
            notes: { ...EMPTY_NOTES },
            excludedNotes: { ...EMPTY_NOTES },
        });
    };

    // cycle: none → include → exclude → none
    const cycleAccord = (name) => {
        const next = { ...value, mode, accords: [...value.accords], excludedAccords: [...value.excludedAccords] };
        if (next.accords.includes(name)) {
            next.accords = next.accords.filter(a => a !== name);
            next.excludedAccords.push(name);
        } else if (next.excludedAccords.includes(name)) {
            next.excludedAccords = next.excludedAccords.filter(a => a !== name);
        } else {
            next.accords.push(name);
        }
        onChange(next);
    };

    const cycleNote = (layer, name) => {
        const notes = { ...value.notes, [layer]: [...value.notes[layer]] };
        const excludedNotes = { ...value.excludedNotes, [layer]: [...value.excludedNotes[layer]] };
        if (notes[layer].includes(name)) {
            notes[layer] = notes[layer].filter(n => n !== name);
            excludedNotes[layer].push(name);
        } else if (excludedNotes[layer].includes(name)) {
            excludedNotes[layer] = excludedNotes[layer].filter(n => n !== name);
        } else {
            notes[layer].push(name);
        }
        onChange({ ...value, mode, notes, excludedNotes });
    };

    const renderTier = ({ key, label, hint, pool, included, excluded, onCycle }) => {
        const finder = (finders[key] || '').toLowerCase();
        const selected = [...included, ...excluded];
        const rest = pool.filter(n => !selected.includes(n) && (!finder || n.toLowerCase().includes(finder)));
        const shown = rest.slice(0, CHIP_LIMIT);
        return (
            <div className="tier" key={key}>
                <div className="th">
                    <span className="tlabel">{label}</span>
                    <span className="hint">{hint}</span>
                </div>
                <input
                    className="finder"
                    type="text"
                    value={finders[key] || ''}
                    onChange={(e) => setFinders(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={`Find within ${pool.length.toLocaleString()}…`}
                />
                <div className="nchips">
                    {included.map(n => (
                        <span key={n} className="nchip inc" onClick={() => onCycle(n)}>{n}</span>
                    ))}
                    {excluded.map(n => (
                        <span key={n} className="nchip exc" onClick={() => onCycle(n)}>{n}</span>
                    ))}
                    {shown.map(n => (
                        <span key={n} className="nchip" onClick={() => onCycle(n)}>{n}</span>
                    ))}
                </div>
                {rest.length > CHIP_LIMIT && (
                    <div className="more-note">{(rest.length - CHIP_LIMIT).toLocaleString()} more — refine to see them</div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className={`scrim${open ? ' on' : ''}`} onClick={onClose} />
            <aside className={`composer${open ? ' on' : ''}`} aria-hidden={!open}>
                <div className="pre">
                    <span>— Compose your scent</span>
                    <button type="button" className="close" onClick={onClose}>✕ close</button>
                </div>
                <h2 className="ttl">Build a <em>composition.</em></h2>
                <p className="intro">Choose notes to seek out, or to banish. We'll find the fragrances that match your architecture.</p>

                <div className="mode">
                    <button type="button" className={mode === 'layered' ? 'on' : ''} onClick={() => setMode('layered')}>
                        Layered · top / heart / base
                    </button>
                    <button type="button" className={mode === 'uncategorized' ? 'on' : ''} onClick={() => setMode('uncategorized')}>
                        Any note
                    </button>
                </div>

                {renderTier({
                    key: 'accords',
                    label: 'Accords',
                    hint: 'the character',
                    pool: availableAccords,
                    included: value.accords,
                    excluded: value.excludedAccords,
                    onCycle: cycleAccord,
                })}

                {mode === 'layered' && (
                    <>
                        {renderTier({
                            key: 'top', label: 'Top notes', hint: 'the opening',
                            pool: availableNotes,
                            included: value.notes.top, excluded: value.excludedNotes.top,
                            onCycle: (n) => cycleNote('top', n),
                        })}
                        {renderTier({
                            key: 'middle', label: 'Heart notes', hint: 'the soul',
                            pool: availableNotes,
                            included: value.notes.middle, excluded: value.excludedNotes.middle,
                            onCycle: (n) => cycleNote('middle', n),
                        })}
                        {renderTier({
                            key: 'base', label: 'Base notes', hint: 'the dry-down',
                            pool: availableNotes,
                            included: value.notes.base, excluded: value.excludedNotes.base,
                            onCycle: (n) => cycleNote('base', n),
                        })}
                    </>
                )}

                {mode === 'uncategorized' && renderTier({
                    key: 'uncategorized', label: 'Notes', hint: 'anywhere in the pyramid',
                    pool: availableNotes,
                    included: value.notes.uncategorized, excluded: value.excludedNotes.uncategorized,
                    onCycle: (n) => cycleNote('uncategorized', n),
                })}

                <div className="legend">
                    <span><span className="d" /> include</span>
                    <span><span className="d exc" /> exclude</span>
                    <span>tap once to include · twice to exclude</span>
                </div>

                <div className="apply">
                    <button type="button" className="btn" onClick={clearAll}>Clear</button>
                    <button type="button" className="btn solid" onClick={onClose}>Show results →</button>
                </div>
            </aside>
        </>
    );
}

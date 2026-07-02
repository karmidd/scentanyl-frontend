import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import LoadingPage from '../primary/LoadingPage.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

/* ════════════════════════════════════════════════════════════════════════
   AllFragrancesPage — "Catalogue + Composer" redesign.

   IMPORTANT: the entire data layer below (fetch params, debounce, stats,
   advancedSearchData shape, load-more) is preserved verbatim from the original
   so it keeps working against your existing backend. Only the *presentation*
   is new. The Composer panel emits the exact advancedSearchData structure your
   /api/fragrances endpoint already understands.

   Two things you may want to reconcile with the real repo:
   1. NOTE_POOL / ACCORD_POOL below are curated fallback lists. If you have an
      endpoint that returns available notes/accords (the old SearchBar advanced
      mode must source these somewhere), fetch them and replace these constants.
   2. The card markup uses fragrance fields {id, name, brand, gender, year,
      accords, imageUrl, slug?}. Adjust to your real FragranceCard payload, or
      drop your <FragranceCard/> back in (you lose the new card styling but keep
      everything else).
═══════════════════════════════════════════════════════════════════════════ */

const PAGE_SIZE = 50;

const toNames = (data) =>
    Array.isArray(data)
        ? data.map((item) => (typeof item === 'object' && item.name ? item.name : item)).filter(Boolean)
        : [];

const EMPTY_ADV = {
    mode: 'regular',
    accords: [], excludedAccords: [],
    notes: { top: [], middle: [], base: [], uncategorized: [] },
    excludedNotes: { top: [], middle: [], base: [], uncategorized: [] },
};

export default function AllFragrancesPage() {
    const { isDarkMode } = useTheme();
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(true);
    const [fragrances, setFragrances] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const [yearSort, setYearSort] = useState('none');
    const [advancedSearchData, setAdvancedSearchData] = useState(EMPTY_ADV);
    const [composerOpen, setComposerOpen] = useState(false);
    const [notePool, setNotePool] = useState([]);
    const [accordPool, setAccordPool] = useState([]);

    const [stats, setStats] = useState({
        minYear: null, maxYear: null,
        genderCounts: { all: 0, men: 0, women: 0, unisex: 0 },
    });

    useEffect(() => { document.title = 'Fragrances | Scentanyl'; }, []);

    // fetch note + accord pools
    useEffect(() => {
        apiFetch(`${API_BASE_URL}/api/notes`)
            .then((r) => r.json()).then((d) => setNotePool(toNames(d)))
            .catch(() => {});
        apiFetch(`${API_BASE_URL}/api/accords`)
            .then((r) => r.json()).then((d) => setAccordPool(toNames(d)))
            .catch(() => {});
    }, [API_BASE_URL]);

    // debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // stats once
    useEffect(() => {
        apiFetch(`${API_BASE_URL}/api/fragrances/stats`)
            .then((r) => r.json())
            .then(setStats)
            .catch((e) => console.error('Error fetching stats:', e));
    }, [API_BASE_URL]);

    const fetchFragrances = useCallback(async (pageNum, append = false) => {
        try {
            const params = new URLSearchParams({
                page: pageNum,
                size: PAGE_SIZE,
                ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
                ...(selectedGender !== 'all' && { gender: selectedGender }),
                ...(yearSort !== 'none' && {
                    sortBy: 'year',
                    sortDirection: yearSort === 'newest' ? 'DESC' : 'ASC',
                }),
                ...(advancedSearchData.mode !== 'regular' && {
                    advancedMode: advancedSearchData.mode,
                    ...(advancedSearchData.accords.length > 0 && { accords: advancedSearchData.accords.join(',') }),
                    ...(advancedSearchData.excludedAccords.length > 0 && { excludedAccords: advancedSearchData.excludedAccords.join(',') }),
                    ...(advancedSearchData.mode === 'layered' && {
                        topNotes: advancedSearchData.notes.top.join(','),
                        middleNotes: advancedSearchData.notes.middle.join(','),
                        baseNotes: advancedSearchData.notes.base.join(','),
                        excludedTopNotes: advancedSearchData.excludedNotes.top.join(','),
                        excludedMiddleNotes: advancedSearchData.excludedNotes.middle.join(','),
                        excludedBaseNotes: advancedSearchData.excludedNotes.base.join(','),
                    }),
                    ...(advancedSearchData.mode === 'uncategorized' && {
                        notes: advancedSearchData.notes.uncategorized.join(','),
                        excludedNotes: advancedSearchData.excludedNotes.uncategorized.join(','),
                    }),
                }),
            });

            const res = await apiFetch(`${API_BASE_URL}/api/fragrances?${params}`);
            const data = await res.json();
            setFragrances((prev) => (append ? [...prev, ...data.content] : data.content));
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (e) {
            console.error('Error fetching fragrances:', e);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [API_BASE_URL, debouncedSearchQuery, selectedGender, yearSort, advancedSearchData]);

    useEffect(() => {
        setPage(0);
        setIsLoadingMore(false);
        fetchFragrances(0, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchQuery, selectedGender, yearSort,
        advancedSearchData.mode, advancedSearchData.accords.length, advancedSearchData.excludedAccords.length,
        JSON.stringify(advancedSearchData.notes), JSON.stringify(advancedSearchData.excludedNotes)]);

    const loadMore = useCallback(() => {
        if (page < totalPages - 1 && !isLoadingMore) {
            const next = page + 1;
            setIsLoadingMore(true);
            setPage(next);
            fetchFragrances(next, true);
        }
    }, [page, totalPages, isLoadingMore, fetchFragrances]);

    const hasMore = page < totalPages - 1;
    const composing =
        advancedSearchData.mode !== 'regular' || !!debouncedSearchQuery || selectedGender !== 'all';

    if (loading) return <LoadingPage />;

    // count of active include/exclude tokens for the Composer button badge
    const tokenCount =
        advancedSearchData.accords.length + advancedSearchData.excludedAccords.length +
        Object.values(advancedSearchData.notes).reduce((s, a) => s + a.length, 0) +
        Object.values(advancedSearchData.excludedNotes).reduce((s, a) => s + a.length, 0);

    return (
        <PageLayout headerNum={1}>
            <style>{cssVars(isDarkMode)}</style>
            <div className="fr-root">

                {/* HERO */}
                <div className="fr-hero">
                    <h1>Discover <em>fragrances.</em></h1>
                    <div className="fr-sub">
                        <b>{(stats.genderCounts?.all || totalElements || 0).toLocaleString()}</b>
                        in the archive · indexing
                    </div>
                </div>

                {/* SEARCH */}
                <div className="fr-search">
                    <span className="ic">⌕</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search fragrances, brands, notes, or accords…"
                    />
                    <span className="kbd">⌘K</span>
                </div>

                {/* FILTER BAR */}
                <div className="fr-filter">
                    <div className="fb-group">
                        <span className="lbl">Gender</span>
                        <div className="seg">
                            {['all', 'men', 'women', 'unisex'].map((g) => (
                                <button key={g} className={selectedGender === g ? 'on' : ''} onClick={() => setSelectedGender(g)}>
                                    {g === 'all' ? 'All' : g[0].toUpperCase() + g.slice(1)}
                                    {stats.genderCounts?.[g] != null && <span className="ct">{abbrev(stats.genderCounts[g])}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="fb-group">
                        <span className="lbl">Year</span>
                        {stats.minYear && <span className="chip">{stats.minYear} — {stats.maxYear}</span>}
                        <div className="seg">
                            {[['none', 'Relevance'], ['newest', 'Newest'], ['oldest', 'Oldest']].map(([v, l]) => (
                                <button key={v} className={yearSort === v ? 'on' : ''} onClick={() => setYearSort(v)}>{l}</button>
                            ))}
                        </div>
                    </div>

                    <ActiveTokens adv={advancedSearchData} onChange={setAdvancedSearchData} />

                    <button className={`adv-btn ${tokenCount ? 'solid' : ''}`} onClick={() => setComposerOpen(true)}>
                        ⊕ Compose your scent{tokenCount ? ` · ${tokenCount}` : ''}
                    </button>
                </div>

                {/* RESULTS LINE */}
                <div className="fr-results">
                    <span>Showing <b>{fragrances.length}</b> {composing ? `of ${totalElements.toLocaleString()} matches` : `of ${totalElements.toLocaleString()}`}</span>
                    <span>{yearSort === 'none' ? 'relevance' : yearSort}</span>
                </div>

                {/* GRID */}
                {fragrances.length > 0 ? (
                    <>
                        <div className="fr-grid">
                            {fragrances.map((f, i) => (
                                <FragCard key={f.id} f={f} i={i} highlight={advancedSearchData.accords} />
                            ))}
                        </div>
                        {hasMore && (
                            <div className="fr-load">
                                <button className="load-btn" onClick={loadMore} disabled={isLoadingMore}>
                                    {isLoadingMore ? 'Loading…' : '↓ Load more fragrances'}
                                </button>
                                <span className="load-note">{fragrances.length} of {totalElements.toLocaleString()}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="fr-empty">
                        <div className="big">Nothing matches that composition.</div>
                        <div className="small">
                            {advancedSearchData.mode !== 'regular'
                                ? 'try removing an excluded note, or widening the search'
                                : 'try adjusting your search terms or filters'}
                        </div>
                    </div>
                )}
            </div>

            {/* COMPOSER */}
            <Composer
                open={composerOpen}
                onClose={() => setComposerOpen(false)}
                adv={advancedSearchData}
                onChange={setAdvancedSearchData}
                notePool={notePool}
                accordPool={accordPool}
            />
        </PageLayout>
    );
}

/* ───── abbreviate big counts (9,210 → 9.2k) ───── */
function abbrev(n) {
    if (n == null) return '';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return String(n);
}

/* ───── A catalogue card ───── */
function FragCard({ f, i, highlight = [] }) {
    const gender = (f.gender || 'unisex').toLowerCase();
    const accords = (Array.isArray(f.accords) ? f.accords : (f.accords ? String(f.accords).split(',').map(a => a.trim()).filter(Boolean) : [])).slice(0, 2);
    const to = f.slug
        ? `/fragrances/${f.slug}`
        : `/fragrances/${encodeURIComponent(f.brand)}/${encodeURIComponent(f.name)}/${f.id}`;
    return (
        <Link
            to={to}
            className="fr-card"
            style={{ animationDelay: `${(i % PAGE_SIZE % 20) * 45}ms` }}
        >
            <div className="slot">
                <span className="sno">№ {String(f.id || '').toString().padStart(4, '0').slice(-4)}</span>
                {f.imageUrl && <img src={f.imageUrl} alt="" loading="lazy" />}
            </div>
            <div className="house">{f.brand}</div>
            <div className="nm">{f.name}</div>
            <div className="accords">
                {accords.map((a) => (
                    <span key={a} className={`ac ${highlight.includes(a) ? 'match' : ''}`}>{a}</span>
                ))}
            </div>
            <div className="foot">
                <span>{f.year || '—'}</span>
                <span className={`gmark ${gender}`}>{gender}</span>
            </div>
        </Link>
    );
}

/* ───── Active include/exclude chips shown inline in the filter bar ───── */
function ActiveTokens({ adv, onChange }) {
    const tokens = [];
    adv.accords.forEach((n) => tokens.push({ n, type: 'inc', bucket: 'accords' }));
    adv.excludedAccords.forEach((n) => tokens.push({ n, type: 'exc', bucket: 'excludedAccords' }));
    ['top', 'middle', 'base', 'uncategorized'].forEach((tier) => {
        adv.notes[tier].forEach((n) => tokens.push({ n, type: 'inc', bucket: 'notes', tier }));
        adv.excludedNotes[tier].forEach((n) => tokens.push({ n, type: 'exc', bucket: 'excludedNotes', tier }));
    });
    if (!tokens.length) return null;

    const remove = (tok) => {
        const next = structuredClone(adv);
        if (tok.bucket === 'accords' || tok.bucket === 'excludedAccords') {
            next[tok.bucket] = next[tok.bucket].filter((x) => x !== tok.n);
        } else {
            next[tok.bucket][tok.tier] = next[tok.bucket][tok.tier].filter((x) => x !== tok.n);
        }
        if (isAdvEmpty(next)) next.mode = 'regular';
        onChange(next);
    };

    return (
        <div className="comp-chips">
            {tokens.map((tok, i) => (
                <span key={i} className={`chip ${tok.type}`}>
                    {tok.n} <span className="x" onClick={() => remove(tok)}>✕</span>
                </span>
            ))}
        </div>
    );
}

function isAdvEmpty(a) {
    return a.accords.length === 0 && a.excludedAccords.length === 0 &&
        Object.values(a.notes).every((x) => x.length === 0) &&
        Object.values(a.excludedNotes).every((x) => x.length === 0);
}

/* ───── Composer slide-out panel ───── */
function Composer({ open, onClose, adv, onChange, notePool, accordPool }) {
    const [mode, setMode] = useState('layered');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    // reset search when mode changes
    useEffect(() => { setSearch(''); }, [mode]);

    const cycle = (tier, note) => {
        const next = structuredClone(adv);
        const inInc = tier ? next.notes[tier].includes(note) : next.accords.includes(note);
        const inExc = tier ? next.excludedNotes[tier].includes(note) : next.excludedAccords.includes(note);
        const incArr = tier ? next.notes[tier] : next.accords;
        const excArr = tier ? next.excludedNotes[tier] : next.excludedAccords;

        if (!inInc && !inExc) incArr.push(note);
        else if (inInc) { incArr.splice(incArr.indexOf(note), 1); excArr.push(note); }
        else { excArr.splice(excArr.indexOf(note), 1); }

        next.mode = isAdvEmpty(next) ? 'regular' : (mode === 'accord' ? 'layered' : mode);
        onChange(next);
    };

    const stateOf = (tier, note) => {
        const inInc = tier ? adv.notes[tier].includes(note) : adv.accords.includes(note);
        const inExc = tier ? adv.excludedNotes[tier].includes(note) : adv.excludedAccords.includes(note);
        return inInc ? 'inc' : inExc ? 'exc' : '';
    };

    const clearAll = () => { onChange(EMPTY_ADV); setSearch(''); };

    const q = search.trim().toLowerCase();
    const filterPool = (pool) => q ? pool.filter((n) => n.toLowerCase().includes(q)) : pool;

    const tiers = mode === 'layered'
        ? [['top', 'Top notes', 'the opening'], ['middle', 'Heart notes', 'the soul'], ['base', 'Base notes', 'the dry-down']]
        : mode === 'accord'
            ? [[null, 'Accords', 'the character']]
            : [['uncategorized', 'Any note', 'anywhere in the pyramid']];

    return (
        <>
            <div className={`fr-scrim ${open ? 'on' : ''}`} onClick={onClose} />
            <aside className={`fr-composer ${open ? 'on' : ''}`}>
                <div className="pre"><span>— Compose your scent</span><span className="close" onClick={onClose}>✕ close</span></div>
                <h2 className="ttl">Build a <em>composition.</em></h2>
                <p className="intro">Choose notes to seek out, or to banish. We'll find the fragrances that match your architecture.</p>

                <div className="mode">
                    {[['layered', 'Layered'], ['accord', 'By accord'], ['uncategorized', 'Any note']].map(([m, l]) => (
                        <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{l}</button>
                    ))}
                </div>

                <div className="comp-search">
                    <span className="csi">⌕</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={mode === 'accord' ? 'Filter accords…' : 'Filter notes…'}
                    />
                    {search && <span className="csx" onClick={() => setSearch('')}>✕</span>}
                </div>

                <div className="comp-body">
                    {tiers.map(([tier, label, hint]) => {
                        const rawPool = tier === null ? accordPool : notePool;
                        const chips = filterPool(rawPool);
                        if (chips.length === 0 && rawPool.length > 0) return (
                            <div className="tier" key={label}>
                                <div className="th"><span className="tlabel">{label}</span><span className="hint">{hint}</span></div>
                                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', padding: '10px 0' }}>No matches</div>
                            </div>
                        );
                        return (
                            <div className="tier" key={label}>
                                <div className="th"><span className="tlabel">{label}</span><span className="hint">{hint}</span></div>
                                <div className="nchips">
                                    {chips.map((n) => (
                                        <span
                                            key={n}
                                            className={`nchip ${stateOf(tier, n)}`}
                                            onClick={() => cycle(tier, n)}
                                        >{n}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="legend">
                    <span><span className="d" /> include</span>
                    <span><span className="d exc" /> exclude</span>
                    <span>tap once to include · twice to exclude</span>
                </div>

                <div className="apply">
                    <button className="btn" onClick={clearAll}>Clear</button>
                    <button className="btn solid" onClick={onClose}>Show results →</button>
                </div>
            </aside>
        </>
    );
}

/* ════════════════════════════════════════════════════════════════════════
   Scoped CSS — namespaced under .fr-root / .fr-composer / .fr-scrim so it
   cannot leak into PageLayout's shared header/footer. Driven by isDarkMode.
═══════════════════════════════════════════════════════════════════════════ */
function cssVars(dark) {
    const t = dark ? {
        bg: '#0a0907', bg2: '#100e0b', paper: '#15120e',
        ink: '#ece6d6', ink2: '#9a9183', ink3: '#5a5346',
        rule: 'rgba(236,230,214,0.18)', ruleSoft: 'rgba(236,230,214,0.08)', hairline: 'rgba(236,230,214,0.14)',
        accent: '#c8965a', accent2: '#d8a878', accentSoft: 'rgba(200,150,90,0.16)',
    } : {
        bg: '#f3efe5', bg2: '#ebe6d8', paper: '#ede8db',
        ink: '#1a1612', ink2: '#6b6457', ink3: '#a39a8a',
        rule: 'rgba(26,22,18,0.20)', ruleSoft: 'rgba(26,22,18,0.08)', hairline: 'rgba(26,22,18,0.14)',
        accent: '#8b5a1f', accent2: '#a5722f', accentSoft: 'rgba(139,90,31,0.14)',
    };
    return `
    .fr-root,.fr-composer,.fr-scrim{
      --bg:${t.bg};--bg-2:${t.bg2};--paper:${t.paper};
      --ink:${t.ink};--ink-2:${t.ink2};--ink-3:${t.ink3};
      --rule:${t.rule};--rule-soft:${t.ruleSoft};--hairline:${t.hairline};
      --accent:${t.accent};--accent-2:${t.accent2};--accent-soft:${t.accentSoft};
      --serif:'Bodoni Moda','Didot',serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,monospace;
      --cols:4;
    }
    .fr-root{color:var(--ink);font-family:var(--sans)}
    .fr-root *,.fr-composer *{box-sizing:border-box}

    .fr-hero{display:flex;justify-content:space-between;align-items:flex-end;padding:8px 0 28px}
    .fr-hero h1{font-family:var(--serif);font-weight:400;font-size:clamp(48px,8vw,120px);line-height:.88;letter-spacing:-.025em;margin:0}
    .fr-hero h1 em{font-style:italic;color:var(--accent)}
    .fr-sub{font-family:var(--mono);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-2);text-align:right;line-height:1.9}
    .fr-sub b{font-family:var(--serif);font-style:italic;font-size:26px;color:var(--ink);display:block;letter-spacing:0;text-transform:none}

    .fr-search{display:flex;align-items:center;gap:18px;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:20px 0}
    .fr-search .ic{font-family:var(--mono);font-size:14px;color:var(--ink-2)}
    .fr-search input{flex:1;background:transparent;border:0;outline:0;font-family:var(--serif);font-style:italic;font-size:clamp(18px,2vw,28px);color:var(--ink)}
    .fr-search input::placeholder{color:var(--ink-3)}
    .fr-search .kbd{font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);border:1px solid var(--hairline);border-radius:3px;padding:3px 8px}

    .fr-filter{display:flex;align-items:center;gap:26px;padding:18px 0;border-bottom:1px solid var(--rule-soft);flex-wrap:wrap}
    .fb-group{display:flex;align-items:center;gap:11px}
    .fb-group .lbl{font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3)}
    .fr-filter .seg{display:inline-flex;border:1px solid var(--rule-soft)}
    .fr-filter .seg button{font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:8px 13px;color:var(--ink-2);background:none;border:0;cursor:pointer;transition:background .2s,color .2s}
    .fr-filter .seg button.on{background:var(--ink);color:var(--bg)}
    .fr-filter .seg button .ct{opacity:.5;margin-left:5px}
    .chip{font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);border:1px solid var(--rule-soft);padding:7px 11px;display:inline-flex;align-items:center;gap:8px}
    .comp-chips{display:flex;gap:6px;flex-wrap:wrap}
    .comp-chips .chip.inc{border-color:var(--accent);color:var(--accent)}
    .comp-chips .chip.exc{border-style:dashed;color:var(--ink-3);text-decoration:line-through}
    .comp-chips .chip .x{cursor:pointer;opacity:.7;text-decoration:none}
    .adv-btn{margin-left:auto;font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);border:1px solid var(--rule);padding:11px 16px;cursor:pointer;background:none;transition:background .25s,color .25s}
    .adv-btn:hover{background:var(--ink);color:var(--bg)}
    .adv-btn.solid{background:var(--accent);border-color:var(--accent);color:var(--bg)}

    .fr-results{display:flex;justify-content:space-between;align-items:baseline;padding:18px 0;font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-2)}
    .fr-results b{font-family:var(--serif);font-style:italic;font-size:24px;color:var(--ink);letter-spacing:0;text-transform:none}

    .gmark{font-family:var(--mono);font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3);display:inline-flex;align-items:center;gap:5px}
    .gmark::before{content:"";width:6px;height:6px;border:1px solid var(--ink-2);display:inline-block}
    .gmark.men::before{background:var(--ink-2)}
    .gmark.women::before{border-radius:50%;background:var(--ink-2)}
    .gmark.unisex::before{border-radius:50%;background:linear-gradient(90deg,var(--ink-2) 50%,transparent 50%)}

    .fr-grid{display:grid;grid-template-columns:repeat(var(--cols),1fr);border:1px solid var(--rule-soft);border-bottom:none}
    .fr-card{border-right:1px solid var(--rule-soft);border-bottom:1px solid var(--rule-soft);padding:20px;display:flex;flex-direction:column;gap:13px;position:relative;cursor:pointer;text-decoration:none;color:var(--ink);animation:frFade .5s cubic-bezier(.2,.6,.2,1) both}
    .fr-card::after{content:"";position:absolute;inset:0;background:var(--accent-soft);opacity:0;transition:opacity .35s;pointer-events:none}
    .fr-card:hover::after{opacity:1}
    .fr-card>*{position:relative}
    @keyframes frFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    .fr-card .slot{aspect-ratio:3/4;width:100%;background:var(--paper);border:1px solid var(--rule-soft);position:relative;overflow:hidden}
    .fr-card .slot::before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(135deg,transparent 0 10px,var(--rule-soft) 10px 11px);opacity:.6}
    .fr-card .slot .sno{position:absolute;top:9px;left:9px;font-family:var(--mono);font-size:8px;letter-spacing:.18em;color:var(--ink-3);text-transform:uppercase;z-index:1}
    .fr-card .slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    .fr-card .house{font-family:var(--mono);font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-2)}
    .fr-card .nm{font-family:var(--serif);font-style:italic;font-size:23px;line-height:1.08;color:var(--ink);transition:color .3s}
    .fr-card:hover .nm{color:var(--accent)}
    .fr-card .accords{display:flex;gap:4px;flex-wrap:wrap}
    .fr-card .ac{font-family:var(--mono);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);border:1px solid var(--rule-soft);padding:3px 7px;border-radius:999px}
    .fr-card .ac.match{border-color:var(--accent);color:var(--accent)}
    .fr-card .foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:4px;font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--ink-3)}

    .fr-load{display:flex;justify-content:center;align-items:center;gap:20px;padding:36px 0 60px}
    .load-btn{font-family:var(--mono);font-size:10px;letter-spacing:.24em;text-transform:uppercase;border:1px solid var(--rule);padding:15px 28px;cursor:pointer;background:none;color:var(--ink);transition:background .25s,color .25s}
    .load-btn:hover{background:var(--ink);color:var(--bg)}
    .load-btn:disabled{opacity:.5;cursor:default}
    .load-note{font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3)}

    .fr-empty{text-align:center;padding:80px 0}
    .fr-empty .big{font-family:var(--serif);font-style:italic;font-size:42px;color:var(--ink-2)}
    .fr-empty .small{font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3);margin-top:14px}

    /* COMPOSER */
    .fr-scrim{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .4s}
    .fr-scrim.on{opacity:1;pointer-events:auto}
    .fr-composer{position:fixed;top:0;right:0;height:100%;width:440px;max-width:92vw;z-index:70;background:var(--bg-2);border-left:1px solid var(--rule);box-shadow:-40px 0 80px -40px rgba(0,0,0,.7);transform:translateX(100%);transition:transform .5s cubic-bezier(.6,0,.2,1);display:flex;flex-direction:column;padding:30px 30px 26px;overflow-y:auto;color:var(--ink);font-family:var(--sans)}
    .fr-composer.on{transform:none}
    .fr-composer .pre{font-family:var(--mono);font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:var(--ink-3);display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
    .fr-composer .pre .close{cursor:pointer;color:var(--ink-2)}
    .fr-composer .ttl{font-family:var(--serif);font-weight:400;font-size:44px;line-height:.92;letter-spacing:-.015em;margin:0 0 6px}
    .fr-composer .ttl em{font-style:italic;color:var(--accent)}
    .fr-composer .intro{font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.45;color:var(--ink-2);margin:0 0 24px;max-width:320px}
    .fr-composer .mode{display:flex;border:1px solid var(--rule-soft);margin-bottom:10px}
    .fr-composer .mode button{flex:1;font-family:var(--mono);font-size:8px;letter-spacing:.14em;text-transform:uppercase;padding:10px 6px;color:var(--ink-2);background:none;border:0;cursor:pointer;transition:background .2s,color .2s}
    .fr-composer .mode button.on{background:var(--ink);color:var(--bg)}
    .comp-search{display:flex;align-items:center;gap:10px;border:1px solid var(--rule-soft);padding:9px 12px;margin-bottom:4px}
    .comp-search .csi{font-size:12px;color:var(--ink-3);flex-shrink:0}
    .comp-search input{flex:1;background:transparent;border:0;outline:0;font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--ink)}
    .comp-search input::placeholder{color:var(--ink-3)}
    .comp-search .csx{font-size:9px;color:var(--ink-3);cursor:pointer;flex-shrink:0}
    .comp-search .csx:hover{color:var(--ink)}
    .fr-composer .comp-body{flex:1}
    .fr-composer .tier{border-top:1px solid var(--rule-soft);padding:18px 0}
    .fr-composer .tier .th{display:flex;justify-content:space-between;align-items:baseline}
    .fr-composer .tier .th .tlabel{font-family:var(--serif);font-style:italic;font-size:20px;color:var(--ink)}
    .fr-composer .tier .th .hint{font-family:var(--mono);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3)}
    .fr-composer .nchips{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;max-height:140px;overflow-y:auto;padding-right:4px}
    .fr-composer .nchips::-webkit-scrollbar{width:8px}
    .fr-composer .nchips::-webkit-scrollbar-track{background:transparent}
    .fr-composer .nchips::-webkit-scrollbar-thumb{background:var(--rule);border-radius:2px}
    .nchip{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:7px 11px;border:1px solid var(--rule-soft);color:var(--ink-2);cursor:pointer;transition:all .2s;user-select:none}
    .nchip:hover{border-color:var(--ink-2)}
    .nchip.inc{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
    .nchip.exc{border-style:dashed;color:var(--ink-3);text-decoration:line-through}
    .fr-composer .legend{font-family:var(--mono);font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);display:flex;gap:16px;margin-top:6px;flex-wrap:wrap}
    .fr-composer .legend span{display:inline-flex;align-items:center;gap:6px}
    .fr-composer .legend .d{width:18px;border-top:1px solid var(--accent)}
    .fr-composer .legend .d.exc{border-top-style:dashed;border-color:var(--ink-3)}
    .fr-composer .apply{position:sticky;bottom:0;background:var(--bg-2);display:flex;gap:8px;margin-top:18px;padding-top:20px;border-top:1px solid var(--rule)}
    .fr-composer .apply .btn{flex:1;font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;padding:15px;border:1px solid var(--rule);text-align:center;cursor:pointer;background:none;color:var(--ink);transition:background .25s,color .25s}
    .fr-composer .apply .btn:hover{background:var(--rule-soft)}
    .fr-composer .apply .btn.solid{background:var(--accent);border-color:var(--accent);color:var(--bg)}

    @media (max-width:1100px){.fr-root{--cols:3}}
    @media (max-width:820px){
      .fr-root{--cols:2}
      .fr-hero{flex-direction:column;align-items:flex-start;gap:16px}
      .fr-sub{text-align:left}
    }
  `;
}

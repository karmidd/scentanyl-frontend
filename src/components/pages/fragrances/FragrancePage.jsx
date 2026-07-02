import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import LoadingPage from '../primary/LoadingPage.jsx';
import NotFoundPage from '../secondary/errors/NotFoundPage.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

/* ════════════════════════════════════════════════════════════════════════
   FragrancePage — "Specimen" redesign.

   Data layer is preserved from the original: same useParams, same fetch URL,
   same error→NotFoundPage, same parse helpers and perfumer-group logic, same
   outbound routes (/brands, /perfumers, /accords, /notes). Only presentation
   is new. Scoped under .sp-root so it can't leak into PageLayout chrome.

   The "From the Salon" block is OPTIONAL — it expects per-fragrance annotations
   that your API doesn't expose yet. It self-hides unless you pass real data into
   the `annotations` array (or wire a fetch). Remove the block entirely if you
   prefer.
═══════════════════════════════════════════════════════════════════════════ */

const TIER_COPY = {
    top:    { label: 'Top notes', name: 'The opening', desc: 'First spray — bright and aromatic, before anything settles.' },
    middle: { label: 'Heart notes', name: 'The soul', desc: 'The character of the scent, blooming as the top fades.' },
    base:   { label: 'Base notes', name: 'The dry-down', desc: 'What lingers, hours later — close to the skin.' },
    uncategorized: { label: 'Other notes', name: 'Uncategorized', desc: 'Notes not assigned to a tier.' },
};

export default function FragrancePage() {
    const { brand, name, id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const [fragrance, setFragrance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const goRandom = async () => {
        try {
            const res = await apiFetch(`${API_BASE_URL}/api/random-frag`);
            const f = await res.json();
            navigate(`/fragrances/${encodeURIComponent(f.brand)}/${encodeURIComponent(f.name)}/${f.id}`);
        } catch {
            navigate('/fragrances');
        }
    };

    useEffect(() => {
        document.title = error
            ? 'Fragrance Not Found | Scentanyl'
            : `${name} by ${brand} | Scentanyl`;
    }, [brand, name, error]);

    useEffect(() => {
        const fetchFragrance = async () => {
            try {
                setLoading(true);
                const res = await apiFetch(`${API_BASE_URL}/api/fragrances/${encodeURIComponent(brand)}/${encodeURIComponent(name)}/${id}`);
                if (!res.ok) throw new Error(`Fragrance "${name}" from the brand "${brand}" not found`);
                const data = await res.json();
                if (!data || !data.name) throw new Error(`Fragrance "${name}" from the brand "${brand}" wasn't found`);
                setFragrance(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFragrance();
    }, [brand, name, id, API_BASE_URL]);

    if (loading) return <LoadingPage />;
    if (error) {
        return (
            <NotFoundPage
                headerNum={1}
                mainMessage={'Fragrance Not Found'}
                secondaryMessage={"Are you sure the URL is correct? If yes, send us a message and we'll sort this out!"}
            />
        );
    }

    /* ── parse helpers (unchanged) ── */
    const parseList = (s) => (!s ? [] : s.split(',').map((x) => x.trim()).filter(Boolean));
    const titleCase = (s) => s.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const handleLinkClick = (e, url) => {
        if (e.button === 1) return;
        if (e.button === 0 && (e.ctrlKey || e.metaKey)) { e.preventDefault(); window.open(url, '_blank'); }
        else if (e.button === 0) { e.preventDefault(); navigate(url); }
    };

    const gender = (fragrance.gender || 'unisex').toLowerCase();
    const accords = parseList(fragrance.accords);

    const noteCount = ['topNotes', 'middleNotes', 'baseNotes', 'uncategorizedNotes']
        .reduce((sum, k) => sum + parseList(fragrance[k]).length, 0);

    // Optional: real annotations would come from an API. Empty → block hides.
    const annotations = fragrance.annotations || [];

    return (
        <PageLayout headerNum={1}>
            <style>{cssVars(isDarkMode)}</style>
            <div className="sp-root">

                {/* breadcrumb */}
                <div className="sp-crumb">
                    <Link to="/fragrances" onMouseDown={(e) => handleLinkClick(e, '/fragrances')} onClick={(e) => e.preventDefault()}>Fragrances</Link>
                    <span className="sep">/</span>
                    <Link to={`/brands/${encodeURIComponent(fragrance.brand)}`} onMouseDown={(e) => handleLinkClick(e, `/brands/${encodeURIComponent(fragrance.brand)}`)} onClick={(e) => e.preventDefault()}>{fragrance.brand}</Link>
                    <span className="sep">/</span>
                    <span className="here">{fragrance.name}</span>
                </div>

                {/* SPECIMEN */}
                <section className="sp-specimen">
                    <div className="img-col">
                        <div className="slot">
                            <span className="sno">№ {String(id).padStart(4, '0').slice(-4)} · specimen</span>
                            {fragrance.imageUrl && <img src={fragrance.imageUrl} alt={`${fragrance.name} by ${fragrance.brand}`} />}
                        </div>
                        <div className="cap">
                            <span>Catalogued</span>
                            {fragrance.imageUrl
                                ? <a href={fragrance.imageUrl} target="_blank" rel="noopener noreferrer">⤴ View on Fragrantica</a>
                                : <span style={{ opacity: .5 }}>image pending</span>}
                        </div>
                    </div>

                    <div className="info-col">
                        <div className="specno">Specimen № {String(id).padStart(4, '0').slice(-4)}</div>
                        <h1>{renderAccentedName(fragrance.name)}</h1>
                        <div className="byline">
                            by <Link to={`/brands/${encodeURIComponent(fragrance.brand)}`} onMouseDown={(e) => handleLinkClick(e, `/brands/${encodeURIComponent(fragrance.brand)}`)} onClick={(e) => e.preventDefault()}>{fragrance.brand}</Link>
                        </div>

                        <div className="meta-table">
                            <div className="row"><span className="k">House</span><span className="v">
                                <Link to={`/brands/${encodeURIComponent(fragrance.brand)}`} onMouseDown={(e) => handleLinkClick(e, `/brands/${encodeURIComponent(fragrance.brand)}`)} onClick={(e) => e.preventDefault()}>{fragrance.brand}</Link>
                            </span></div>

                            {fragrance.perfumerNames && (
                                <div className="row"><span className="k">Perfumer</span><span className="v">
                                    <Perfumers raw={fragrance.perfumerNames} handleLinkClick={handleLinkClick} />
                                </span></div>
                            )}

                            {fragrance.year && (
                                <div className="row"><span className="k">Released</span><span className="v">{fragrance.year}</span></div>
                            )}

                            <div className="row"><span className="k">Gender</span><span className="v"><span className={`gmark ${gender}`}>{gender}</span></span></div>

                            {accords.length > 0 && (
                                <div className="row"><span className="k">Accords</span><span className="v">
                                    <span className="accord-pills">
                                        {accords.map((a, i) => (
                                            <Link key={i} className="pill" to={`/accords/${encodeURIComponent(a)}`} onMouseDown={(e) => handleLinkClick(e, `/accords/${encodeURIComponent(a)}`)} onClick={(e) => e.preventDefault()}>{titleCase(a)}</Link>
                                        ))}
                                    </span>
                                </span></div>
                            )}
                        </div>

                        <div className="actions">
                            <button className="btn solid">＋ Add to shelf</button>
                            <button className="btn">Annotate</button>
                            <button className="btn" onClick={goRandom}>Random ⤳</button>
                        </div>
                    </div>
                </section>

                {/* PYRAMID */}
                {(fragrance.topNotes || fragrance.middleNotes || fragrance.baseNotes || fragrance.uncategorizedNotes) && (
                    <section className="sp-pyramid">
                        <div className="pyr-head">
                            <span className="t">The pyramid</span>
                            <span className="sub">— read top to base —</span>
                        </div>
                        {['top', 'middle', 'base', 'uncategorized'].map((tier) => {
                            const key = tier === 'uncategorized' ? 'uncategorizedNotes' : `${tier}Notes`;
                            const notes = parseList(fragrance[key]);
                            if (!notes.length) return null;
                            return (
                                <Tier
                                    key={tier}
                                    tier={tier}
                                    notes={notes}
                                    handleLinkClick={handleLinkClick}
                                />
                            );
                        })}
                    </section>
                )}

                {/* FROM THE SALON (optional — hides when no annotations) */}
                {annotations.length > 0 && (
                    <section className="sp-salon">
                        <div className="sh">
                            <span className="t">From the <em>Salon</em></span>
                            <Link to="/salon">All annotations →</Link>
                        </div>
                        {annotations.map((a, i) => (
                            <div className="annot" key={i}>
                                <div>
                                    <span className="kind">— {a.kind || 'Annotation'}</span>
                                    <div className="atext">{a.text}</div>
                                </div>
                                <div className="ameta"><b>{a.author}</b>{a.when}<br />{a.rating}</div>
                            </div>
                        ))}
                    </section>
                )}

                {/* MORE */}
                <section className="sp-more">
                    <div className="t">Explore more fragrances</div>
                    <div className="sub">{noteCount} notes · {accords.length} accords catalogued</div>
                    <div className="row">
                        <button className="btn" onClick={() => navigate('/fragrances')}>← Back to all fragrances</button>
                        <button className="btn solid" onClick={goRandom}>Random discovery ⤳</button>
                    </div>
                </section>

            </div>
        </PageLayout>
    );
}

/* Accent the last word of the name in italic (matches the mock's "Tobacco Vanille") */
function renderAccentedName(name) {
    const words = (name || '').trim().split(' ');
    if (words.length === 1) return <em>{words[0]}</em>;
    const head = words.slice(0, -1).join(' ');
    const tail = words.slice(-1)[0];
    return <>{head} <em>{tail}</em></>;
}

/* Tier with scroll-reveal */
function Tier({ tier, notes, handleLinkClick }) {
    const ref = React.useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) { setInView(true); io.unobserve(el); } });
        }, { threshold: 0.3 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    const copy = TIER_COPY[tier];
    return (
        <div ref={ref} className={`tier ${tier === 'middle' ? 'heart' : ''} ${inView ? 'in' : ''}`}>
            <div className="label">
                <div className="ti">{copy.label}</div>
                <div className="tn">{copy.name}</div>
                <div className="desc">{copy.desc}</div>
            </div>
            <div className="notes">
                {notes.map((n, i) => (
                    <Link
                        key={i}
                        className="note"
                        style={{ transitionDelay: `${i * 70}ms` }}
                        to={`/notes/${encodeURIComponent(n)}`}
                        onMouseDown={(e) => handleLinkClick(e, `/notes/${encodeURIComponent(n)}`)}
                        onClick={(e) => e.preventDefault()}
                    >{n}</Link>
                ))}
            </div>
        </div>
    );
}

/* Perfumer rendering — preserves the original group / individual logic */
function Perfumers({ raw, handleLinkClick }) {
    const groups = raw.split(',').map((p) => p.trim()).filter(Boolean);
    return (
        <span className="perfumers">
            {groups.map((group, gi) => {
                const individuals = group.replaceAll(' | ', ', ').split(',').map((p) => p.trim());
                return (
                    <span key={gi}>
                        {individuals.map((perfumer, pi) => {
                            const clickable = perfumer && perfumer.toLowerCase() !== 'n/a';
                            return (
                                <span key={pi}>
                                    {clickable ? (
                                        <Link to={`/perfumers/${encodeURIComponent(perfumer)}`} onMouseDown={(e) => handleLinkClick(e, `/perfumers/${encodeURIComponent(perfumer)}`)} onClick={(e) => e.preventDefault()}>{perfumer}</Link>
                                    ) : perfumer}
                                    {pi < individuals.length - 1 && <span className="dim">, </span>}
                                </span>
                            );
                        })}
                        {gi < groups.length - 1 && <span className="dim">; </span>}
                    </span>
                );
            })}
        </span>
    );
}

/* ════════════════════════════════════════════════════════════════════════ */
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
    .sp-root{
      --bg:${t.bg};--bg-2:${t.bg2};--paper:${t.paper};
      --ink:${t.ink};--ink-2:${t.ink2};--ink-3:${t.ink3};
      --rule:${t.rule};--rule-soft:${t.ruleSoft};--hairline:${t.hairline};
      --accent:${t.accent};--accent-2:${t.accent2};--accent-soft:${t.accentSoft};
      --serif:'Bodoni Moda','Didot',serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,monospace;
      color:var(--ink);font-family:var(--sans);max-width:1320px;margin:0 auto;
    }
    .sp-root *{box-sizing:border-box}
    .sp-root a{color:inherit;text-decoration:none}

    .sp-crumb{font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3);padding:8px 0 0}
    .sp-crumb a{transition:color .25s}.sp-crumb a:hover{color:var(--ink)}
    .sp-crumb .here{color:var(--accent)}
    .sp-crumb .sep{margin:0 10px;opacity:.5}

    .sp-specimen{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--rule-soft);margin-top:24px}
    .sp-specimen .img-col{border-right:1px solid var(--rule-soft);padding:40px;display:flex;flex-direction:column}
    .sp-specimen .slot{aspect-ratio:4/5;width:100%;background:var(--paper);border:1px solid var(--rule-soft);position:relative;overflow:hidden}
    .sp-specimen .slot::before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(135deg,transparent 0 12px,var(--rule-soft) 12px 13px);opacity:.6}
    .sp-specimen .slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
    .sp-specimen .slot .sno{position:absolute;top:12px;left:12px;font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3);z-index:2}
    .sp-specimen .cap{display:flex;justify-content:space-between;align-items:center;margin-top:16px;font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3)}
    .sp-specimen .cap a{color:var(--accent);transition:opacity .2s}.sp-specimen .cap a:hover{opacity:.7}
    .sp-specimen .info-col{padding:44px 40px;display:flex;flex-direction:column}
    .sp-specimen .specno{font-family:var(--mono);font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-3);margin-bottom:22px}
    .sp-specimen h1{font-family:var(--serif);font-weight:400;font-size:clamp(44px,5.5vw,84px);line-height:.9;letter-spacing:-.02em;margin:0 0 8px}
    .sp-specimen h1 em{font-style:italic}
    .sp-specimen .byline{font-family:var(--serif);font-style:italic;font-size:24px;color:var(--ink-2);margin-bottom:30px}
    .sp-specimen .byline a{color:var(--accent);transition:opacity .2s}.sp-specimen .byline a:hover{opacity:.7}
    .meta-table{border-top:1px solid var(--rule-soft)}
    .meta-table .row{display:grid;grid-template-columns:130px 1fr;gap:18px;padding:15px 0;border-bottom:1px solid var(--rule-soft);align-items:center}
    .meta-table .k{font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3)}
    .meta-table .v{font-family:var(--serif);font-style:italic;font-size:19px;color:var(--ink)}
    .meta-table .v a{transition:color .2s}.meta-table .v a:hover{color:var(--accent)}
    .meta-table .v .dim{color:var(--ink-3);font-style:normal}
    .gmark{font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-2);display:inline-flex;align-items:center;gap:7px}
    .gmark::before{content:"";width:8px;height:8px;border:1px solid var(--ink-2);display:inline-block}
    .gmark.men::before{background:var(--ink-2)}
    .gmark.women::before{border-radius:50%;background:var(--ink-2)}
    .gmark.unisex::before{border-radius:50%;background:linear-gradient(90deg,var(--ink-2) 50%,transparent 50%)}
    .accord-pills{display:flex;gap:6px;flex-wrap:wrap}
    .pill{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);border:1px solid var(--rule-soft);padding:9px 16px;border-radius:999px;transition:border-color .25s,color .25s}
    .pill:hover{border-color:var(--accent);color:var(--accent)}
    .actions{display:flex;gap:8px;margin-top:30px;flex-wrap:wrap}
    .btn{font-family:var(--mono);font-size:9px;letter-spacing:.24em;text-transform:uppercase;padding:14px 20px;border:1px solid var(--rule);color:var(--ink);cursor:pointer;background:none;transition:background .25s,color .25s,border-color .25s}
    .btn:hover{background:var(--ink);color:var(--bg);border-color:var(--ink)}
    .btn.solid{background:var(--accent);color:var(--bg);border-color:var(--accent)}
    .btn.solid:hover{background:var(--accent-2);border-color:var(--accent-2)}

    .sp-pyramid{border:1px solid var(--rule-soft);border-top:none}
    .pyr-head{display:flex;justify-content:space-between;align-items:baseline;padding:30px 40px 0}
    .pyr-head .t{font-family:var(--serif);font-style:italic;font-size:30px;color:var(--ink)}
    .pyr-head .sub{font-family:var(--mono);font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-3)}
    .tier{display:grid;grid-template-columns:240px 1fr;gap:32px;align-items:start;padding:32px 40px;border-bottom:1px solid var(--rule-soft);position:relative}
    .tier:last-child{border-bottom:none}
    .tier::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--accent);transform:scaleY(0);transform-origin:top;transition:transform .8s cubic-bezier(.2,.6,.2,1)}
    .tier.in::before{transform:scaleY(1)}
    .tier .ti{font-family:var(--mono);font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-3)}
    .tier .tn{font-family:var(--serif);font-style:italic;font-size:34px;line-height:1;color:var(--ink);margin-top:8px}
    .tier.heart .tn{color:var(--accent)}
    .tier .desc{font-family:var(--sans);font-size:12px;line-height:1.6;color:var(--ink-2);margin-top:12px;max-width:200px}
    .tier .notes{display:flex;gap:8px;flex-wrap:wrap;padding-top:6px}
    .note{font-family:var(--mono);font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2);border:1px solid var(--rule-soft);padding:13px 20px;cursor:pointer;transition:border-color .25s,color .25s,opacity .5s,transform .5s,background .25s;opacity:0;transform:translateY(12px)}
    .tier.in .note{opacity:1;transform:none}
    .note:hover{border-color:var(--accent);color:var(--accent);transition-delay:0s!important}
    .tier.heart .note{background:var(--accent-soft);border-color:transparent}
    .tier.heart .note:hover{border-color:var(--accent);transition-delay:0s!important}

    .sp-salon{border:1px solid var(--rule-soft);border-top:none;padding:36px 40px}
    .sp-salon .sh{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:24px}
    .sp-salon .sh .t{font-family:var(--serif);font-style:italic;font-size:26px}
    .sp-salon .sh .t em{color:var(--accent);font-style:normal}
    .sp-salon .sh a{font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-2);border-bottom:1px solid var(--accent);padding-bottom:3px;transition:color .25s}
    .sp-salon .sh a:hover{color:var(--accent)}
    .annot{display:grid;grid-template-columns:1fr 130px;gap:24px;padding:22px 0;border-top:1px solid var(--rule-soft)}
    .annot .kind{font-family:var(--mono);font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);border:1px solid var(--accent);padding:3px 8px;display:inline-block;margin-bottom:10px}
    .annot .atext{font-family:var(--serif);font-style:italic;font-size:18px;line-height:1.4;color:var(--ink)}
    .annot .ameta{font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);text-align:right;line-height:1.9}
    .annot .ameta b{font-family:var(--serif);font-style:italic;font-size:15px;color:var(--ink);display:block;letter-spacing:0;text-transform:none;margin-bottom:4px}

    .sp-more{padding:60px 0 90px;text-align:center}
    .sp-more .t{font-family:var(--serif);font-style:italic;font-size:30px;color:var(--ink);margin-bottom:8px}
    .sp-more .sub{font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3);margin-bottom:26px}
    .sp-more .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}

    @media (max-width:880px){
      .sp-specimen{grid-template-columns:1fr}
      .sp-specimen .img-col{border-right:none;border-bottom:1px solid var(--rule-soft)}
      .sp-specimen .info-col,.sp-specimen .img-col{padding:28px 24px}
      .tier{grid-template-columns:1fr;gap:14px;padding:26px 24px}
      .tier .desc{max-width:none}
      .annot{grid-template-columns:1fr}.annot .ameta{text-align:left}
    }
  `;
}

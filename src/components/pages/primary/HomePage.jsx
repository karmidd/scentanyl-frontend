import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import LoadingPage from './LoadingPage.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

/* ────────────────────────────────────────────────────────────────────────
   STUB FORUM DATA
   Replace these with real fetches once the endpoints exist, e.g.
     apiFetch(`${API_BASE_URL}/api/salon?count=3&sort=recent`)
     apiFetch(`${API_BASE_URL}/api/annotations?count=3&sort=recent`)
   The shape below is all the UI needs.
──────────────────────────────────────────────────────────────────────── */
const SALON_THREADS = [
    {
        id: 's1', kind: 'Thread',
        title: ['On the disappearance of ', 'true oakmoss', ', and what we lost with it.'],
        excerpt: "Since IFRA's '08 restrictions, classical chypres have been quietly rewritten. Has anyone found a modern composition that genuinely replaces the wet-forest-floor sensation of vintage Mitsouko?",
        tags: ['Chypre', 'Oakmoss', 'Vintage', 'IFRA'],
        author: 'Olivier C.', when: '2 days ago', sub: 'cited 12 frag.',
        stat: 47, statLabel: 'annotations', saved: 88, accent: true,
    },
    {
        id: 's2', kind: 'Question',
        title: ['Is Aventus — honestly — ', 'still good', ', or are we re-buying out of habit?'],
        excerpt: 'Batch variation aside. I am interested in whether the composition itself feels dated in 2026, or if the issue is purely fatigue of ubiquity. Looking for unfashionable opinions.',
        tags: ['Creed', 'Aventus', 'Hot take'],
        author: 'Hideo T.', when: '3 days ago', sub: 'cited 8 frag.',
        stat: 89, statLabel: 'annotations', saved: 142, accent: true,
    },
    {
        id: 's3', kind: 'Thread · perfumer in residence',
        title: ['Frédéric Malle on the ethics of a ', '32-ingredient', ' formula.'],
        excerpt: 'An open Q&A through Thursday. Submit a question; the most-saved three will be answered in long form. Past sessions are archived in the salon library.',
        tags: ['Q&A', 'Frédéric Malle', 'Perfumer'],
        author: 'Editorial', when: '1 week ago', sub: 'open until Thu',
        stat: 156, statLabel: 'questions', saved: 412, accent: false,
    },
];

const ANNOTATIONS = [
    {
        id: 'a1', kind: 'Annotation · 6 months in',
        title: ['Tobacco ', 'Vanille', ' — after a winter.'],
        excerpt: "A long-form revisit. The opening still announces itself, but the drydown has revealed a softness I didn't notice in October — almost a tonka-pipe sweetness, very late evening, very 'old library'.",
        tags: ['Tom Ford', 'Tobacco', 'Long-wear'],
        author: 'Margaux V.', when: '5 days ago', sub: '★★★★★ 5 of 5',
        stat: 23, statLabel: 'marginalia', saved: 211, review: true,
    },
    {
        id: 'a2', kind: 'Annotation',
        title: ['Mojave ', 'Ghost', ' — a quiet skin scent that takes a season to read.'],
        excerpt: 'Restrained to the point of frustration on first wear; on the fourth, suddenly indispensable. A study in patience and proximity.',
        tags: ['Byredo', 'Ambrette', 'Skin scent'],
        author: 'Anya R.', when: '1 week ago', sub: '★★★★ 4 of 5',
        stat: 11, statLabel: 'marginalia', saved: 67, review: true,
    },
    {
        id: 'a3', kind: 'Annotation · revisited',
        title: ["Bal d'", 'Afrique', ' — the case for keeping it on the shelf.'],
        excerpt: 'Often dismissed as a beginner Byredo; an unfair reputation. Worn in late-summer evenings it reveals a violet-cedar quietness nothing else in the lineup manages.',
        tags: ['Byredo', 'Neroli', 'Summer'],
        author: 'Lior K.', when: '2 weeks ago', sub: '★★★★ 4 of 5',
        stat: 31, statLabel: 'marginalia', saved: 104, review: true,
    },
];

const CHANNELS = [
    { id: 'featured',    label: 'Featured' },
    { id: 'salon',       label: 'Salon',       count: '218' },
    { id: 'annotations', label: 'Annotations', count: '1.4k' },
    { id: 'arrivals',    label: 'New arrivals' },
    { id: 'random',      label: 'Random' },
];

/* ── Map a fragrance object from your API into an entry row.
      Adjust the field names to match your real payload.            ── */
function fragToEntry(f, i, kindLabel = "Editor's pick") {
    const name = f?.name || f?.fragrance || 'Untitled';
    const words = name.trim().split(' ');
    const head = words.slice(0, -1).join(' ');
    const tail = words.slice(-1)[0];
    const accords = Array.isArray(f?.accords)
        ? f.accords
        : (f?.accords ? String(f.accords).split(',').map(a => a.trim()).filter(Boolean) : []);
    return {
        id: f?.id || f?.slug || i,
        slug: f?.slug || f?.id,
        kind: kindLabel,
        feature: true,
        titleParts: head ? [head + ' ', tail] : [tail],
        excerpt: f?.description || accords.join(' · ') || '',
        tags: [f?.brand, f?.year, ...accords].filter(Boolean).slice(0, 4),
        author: f?.brand || '—',
        when: f?.year || '',
        sub: f?.perfumer || '',
        stat: f?.rating ? Number(f.rating).toFixed(1) : '—',
        statLabel: 'salon rating',
        saved: f?.annotationCount ?? 0,
        savedLabel: 'annotations',
        img: f?.thumbnail || f?.image || null,
    };
}

export default function HomePage() {
    const { isDarkMode } = useTheme();
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const [featured, setFeatured] = useState([]);
    const [arrivals, setArrivals] = useState([]);
    const [randomPicks, setRandomPicks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [channel, setChannel] = useState('salon');

    useEffect(() => { document.title = 'Scentanyl'; }, []);

    const fetchRandom = useCallback(async (count = 3) => {
        const res = await apiFetch(`${API_BASE_URL}/api/random-frag?count=${count}`);
        return res.ok ? res.json() : [];
    }, [API_BASE_URL]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [feat, arr, rnd] = await Promise.all([
                    fetchRandom(3), fetchRandom(3), fetchRandom(3),
                ]);
                setFeatured(feat);
                setArrivals(arr);
                setRandomPicks(rnd);
            } catch (e) {
                console.error('Error fetching home data:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [fetchRandom]);

    if (loading) return <LoadingPage />;

    const featuredEntries = featured.map((f, i) => fragToEntry(f, i, "Editor's pick · winter"));
    const arrivalEntries  = arrivals.map((f, i) => fragToEntry(f, i, 'Added this week'));
    const randomEntries   = randomPicks.map((f, i) => fragToEntry(f, i, 'Selected at random'));

    return (
        <PageLayout headerNum={0}>
            <style>{cssVars(isDarkMode)}</style>
            <div className="sl-root">

                {/* ───── HERO ───── */}
                <section className="sl-hero">
                    <div className="sl-issue">
                        <span>Vol. I — № 001</span>
                        <span>21,409 fragrances · 1,842 houses</span>
                        <span>Spring / Summer 2026</span>
                    </div>
                    <h1 className="sl-h1">
                        <span className="l1">Get addicted.</span>
                        <span className="l2">Then write it down.</span>
                    </h1>
                    <div className="sl-below">
                        <p className="sl-lede">
                            A working archive of the world's most considered perfumery —{' '}
                            <strong>collected</strong>, indexed, and presented without hurry.
                            Begin anywhere; you will not finish.
                        </p>
                        <div className="sl-meta-right">
                            <b>Tonight's specimen</b>
                            Tom Ford · Tuscan Leather<br />
                            Oud · Saffron · Leather<br />
                            — selected at random
                        </div>
                    </div>
                    <div className="sl-tagline">
                        <span>— for the considered nose</span>
                        <span className="sl-pill sl-accent">⌘ K · search the archive</span>
                        <span>est. 2024 · <span className="sl-accent">indexing in progress</span></span>
                    </div>
                </section>

                {/* ───── SALON HYBRID ───── */}
                <div className="sl-grid">
                    {/* LEFT */}
                    <aside className="sl-left">
                        <div className="sl-block">
                            <div className="sl-pre"><span>— Manifesto</span><span>Vol. I</span></div>
                            <h2 className="sl-manifesto">Of <em>scent,</em> in earnest.</h2>
                            <p className="sl-body">Two thousand houses. Twenty-one thousand bottles. One quiet place to walk through them all.</p>
                            <p className="sl-body alt">No ratings out of ten. No buy-now urgency. Only annotations, written by members who have lived with a bottle long enough to mean it.</p>
                        </div>

                        <div className="sl-block">
                            <div className="sl-pre"><span>— Member</span><span>since '24</span></div>
                            <div className="sl-member">
                                <div className="sl-avatar">N</div>
                                <div>
                                    <div className="sl-who">Anonymous <em>Nose</em></div>
                                    <div className="sl-sub">12 annotations · 47 saved<br />3 shelves · prefers oud, iris</div>
                                </div>
                            </div>
                            <div className="sl-shelf-strip">
                                {[1, 2, 3, 4].map((n) => (
                                    <div className="sl-shelf" key={n}><span className="sl-shelf-lbl">{String(n).padStart(2, '0')}</span></div>
                                ))}
                                <div className="sl-shelf add"><span className="sl-shelf-lbl">+</span></div>
                            </div>
                            <div className="sl-pre" style={{ marginTop: 14, marginBottom: 0 }}><span>— Your shelf</span><span>4 of 12</span></div>
                        </div>

                        <div className="sl-block">
                            <div className="sl-pre"><span>— Tonight in the Salon</span><span>open thread</span></div>
                            <p className="sl-tonight">Is the disappearance of <em>true oakmoss</em> the greatest loss in modern perfumery?</p>
                            <span className="sl-by">— posed by Olivier C. · 2 days · 47 annotations</span>
                            <div className="sl-ctas" style={{ marginTop: 20 }}>
                                <Link to="/salon" className="sl-btn solid">Annotate</Link>
                                <Link to="/salon" className="sl-btn">Read salon →</Link>
                            </div>
                        </div>

                        <div className="sl-block">
                            <div className="sl-pre" style={{ marginBottom: 14 }}><span>— Contribute</span><span>members only</span></div>
                            <div className="sl-ctas">
                                <button className="sl-btn ghost">Write a review</button>
                                <button className="sl-btn ghost">Open a thread</button>
                                <button className="sl-btn ghost">Random ⤳</button>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT */}
                    <main className="sl-right">
                        <div className="sl-channels">
                            <div className="sl-ch-group">
                                {CHANNELS.map((c) => (
                                    <button
                                        key={c.id}
                                        className={`sl-ch ${channel === c.id ? 'on' : ''}`}
                                        onClick={() => setChannel(c.id)}
                                    >
                                        {c.label}{c.count && <span className="sl-ch-n">{c.count}</span>}
                                    </button>
                                ))}
                            </div>
                            <div className="sl-filter">Sorted by <b>recent activity</b></div>
                        </div>

                        {channel === 'salon' && (
                            <Channel
                                entries={SALON_THREADS}
                                footL={<><b>218</b> open threads · 14 perfumers in residence</>}
                                footCta="See all in Salon" to="/salon"
                            />
                        )}
                        {channel === 'featured' && (
                            <Channel
                                entries={featuredEntries}
                                footL={<><b>21,409</b> fragrances catalogued · indexing in progress</>}
                                footCta="See all fragrances" to="/fragrances"
                            />
                        )}
                        {channel === 'annotations' && (
                            <Channel
                                entries={ANNOTATIONS}
                                footL={<><b>1,422</b> annotations · across 387 fragrances</>}
                                footCta="Read all annotations" to="/salon"
                            />
                        )}
                        {channel === 'arrivals' && (
                            <Channel
                                entries={arrivalEntries}
                                footL={<><b>42</b> fragrances added this month · 9 reformulations</>}
                                footCta="See all new arrivals" to="/fragrances"
                            />
                        )}
                        {channel === 'random' && (
                            <Channel
                                entries={randomEntries}
                                footL={<>press <b>R</b> at any time · we will choose for you</>}
                                footCta="Surprise me again"
                                onCta={async () => setRandomPicks(await fetchRandom(3))}
                            />
                        )}
                    </main>
                </div>

                {/* ───── DRIFT ───── */}
                <section className="sl-drift">
                    <div className="sl-drift-inner">
                        <div className="sl-drift-l"><b>21,409</b>fragrances catalogued<br />indexing in progress</div>
                        <div className="sl-drift-c">
                            <div className="word"><em>—</em> get addicted <em>—</em></div>
                            <div className="sub">then write it down</div>
                        </div>
                        <div className="sl-drift-r"><b>1,842</b>houses · 6,712 notes<br />across 158 years</div>
                    </div>
                </section>

            </div>
        </PageLayout>
    );
}

/* ───── A single channel: ledger of entries + see-all footer ───── */
function Channel({ entries, footL, footCta, to, onCta }) {
    return (
        <section className="sl-channel">
            <div className="sl-ledger">
                {entries.map((e, i) => <Entry key={e.id || i} e={e} n={i + 1} />)}
            </div>
            <div className="sl-see-all">
                <div className="sl-see-l">{footL}</div>
                {onCta ? (
                    <button className="sl-cta" onClick={onCta}>{footCta} <span className="arrow">→</span></button>
                ) : (
                    <Link className="sl-cta" to={to || '#'}>{footCta} <span className="arrow">→</span></Link>
                )}
            </div>
        </section>
    );
}

/* ───── One ledger row (works for both forum entries and fragrances) ───── */
function Entry({ e, n }) {
    const title = e.titleParts || e.title;
    const kindClass = e.review ? 'review' : e.feature ? 'feature' : /question/i.test(e.kind || '') ? 'question' : '';
    return (
        <article className={`sl-entry ${e.feature ? 'with-img' : ''}`}>
            <span className="sl-num">{String(n).padStart(3, '0')}</span>
            {e.feature && (
                <div className="sl-spec">
                    <span className="sl-specno">{e.img ? '' : 'placeholder'}</span>
                    <span className="sl-specsize">3 : 4</span>
                    {e.img && <img src={e.img} alt="" className="sl-spec-img" />}
                </div>
            )}
            <div>
                <span className={`sl-kind ${kindClass}`}>— {e.kind}</span>
                <h3 className="sl-ttl">
                    {title.map((part, idx) =>
                        idx === 1 ? <em key={idx}>{part}</em> : <React.Fragment key={idx}>{part}</React.Fragment>
                    )}
                </h3>
                {e.excerpt && <p className="sl-excerpt">{e.excerpt}</p>}
                {e.tags?.length > 0 && (
                    <div className="sl-tags">
                        {e.tags.map((t, i) => <span className="sl-tag" key={i}>{t}</span>)}
                    </div>
                )}
            </div>
            <div className="sl-meta"><b>{e.author}</b>{e.when}<br />{e.sub}</div>
            <div className="sl-stats">
                <span className={`sl-big ${e.accent ? 'accent' : ''}`}>{e.stat}</span>
                <span className="sl-stat-row">{e.statLabel}</span>
                <span className="sl-stat-row" style={{ opacity: .6, marginTop: 8 }}>
                    {e.savedLabel ? `${e.saved} ${e.savedLabel}` : `✦ ${e.saved} saved`}
                </span>
            </div>
        </article>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   Scoped CSS. Driven by `isDarkMode` from your ThemeContext so it stays in
   lockstep with the rest of the app. Everything is namespaced under .sl-root
   so it cannot leak into PageLayout's header/footer.
──────────────────────────────────────────────────────────────────────── */
function cssVars(dark) {
    const t = dark ? {
        ink: '#ece6d6', ink2: '#9a9183', ink3: '#5a5346',
        rule: 'rgba(236,230,214,0.18)', ruleSoft: 'rgba(236,230,214,0.08)',
        paper: '#15120e', accent: '#c8965a', accentSoft: 'rgba(200,150,90,0.16)',
    } : {
        ink: '#1a1612', ink2: '#6b6457', ink3: '#a39a8a',
        rule: 'rgba(26,22,18,0.20)', ruleSoft: 'rgba(26,22,18,0.08)',
        paper: '#ede8db', accent: '#8b5a1f', accentSoft: 'rgba(139,90,31,0.14)',
    };
    return `
    .sl-root{
      --ink:${t.ink};--ink-2:${t.ink2};--ink-3:${t.ink3};
      --rule:${t.rule};--rule-soft:${t.ruleSoft};--paper:${t.paper};
      --accent:${t.accent};--accent-soft:${t.accentSoft};
      --serif:'Playfair Display','Georgia',serif;
      --sans:'Inter',system-ui,sans-serif;
      --mono:'JetBrains Mono',ui-monospace,monospace;
      color:var(--ink);font-family:var(--sans);
    }
    .sl-root *{box-sizing:border-box}

    /* HERO */
    .sl-hero{position:relative;padding:60px 0 70px;border-bottom:1px solid var(--rule)}
    .sl-issue{display:flex;justify-content:space-between;gap:24px;font-family:var(--mono);font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--ink-3);margin-bottom:44px;flex-wrap:wrap}
    .sl-h1{font-family:var(--serif);font-weight:400;font-size:clamp(72px,12vw,212px);line-height:.88;letter-spacing:-.025em;margin:0;color:var(--ink)}
    .sl-h1 .l1{display:block}
    .sl-h1 .l2{display:block;padding-left:.32em;font-style:italic;color:var(--accent)}
    .sl-below{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:44px;align-items:end}
    .sl-lede{font-family:var(--serif);font-style:italic;font-size:clamp(19px,1.7vw,27px);line-height:1.35;max-width:520px;color:var(--ink);margin:0}
    .sl-lede strong{font-style:normal;font-weight:500;color:var(--accent)}
    .sl-meta-right{font-family:var(--mono);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-2);text-align:right;line-height:2}
    .sl-meta-right b{color:var(--ink);font-weight:500;font-family:var(--serif);font-style:italic;font-size:18px;letter-spacing:0;text-transform:none}
    .sl-tagline{margin-top:56px;padding:22px 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;font-family:var(--mono);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--ink-2)}
    .sl-pill{padding:6px 14px;border:1px solid var(--rule-soft);border-radius:999px;color:var(--ink)}
    .sl-accent{color:var(--accent)}

    /* GRID */
    .sl-grid{display:grid;grid-template-columns:340px 1fr;border-bottom:1px solid var(--rule)}
    .sl-left{padding:56px 40px 56px 0;border-right:1px solid var(--rule);position:sticky;top:80px;height:fit-content;display:flex;flex-direction:column;gap:36px}
    .sl-block{padding-bottom:28px;border-bottom:1px solid var(--rule-soft)}
    .sl-block:last-child{border-bottom:none;padding-bottom:0}
    .sl-pre{font-family:var(--mono);font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:var(--ink-3);display:flex;justify-content:space-between;margin-bottom:14px}
    .sl-manifesto{font-family:var(--serif);font-weight:400;font-size:60px;line-height:.92;letter-spacing:-.02em;margin:0 0 16px;color:var(--ink)}
    .sl-manifesto em{font-style:italic;color:var(--accent)}
    .sl-body{font-family:var(--serif);font-style:italic;font-size:16px;line-height:1.5;color:var(--ink);max-width:280px;margin:0 0 12px}
    .sl-body.alt{font-style:normal;font-family:var(--sans);font-size:12px;line-height:1.7;color:var(--ink-2)}
    .sl-member{display:flex;gap:14px;align-items:flex-start}
    .sl-avatar{width:52px;height:52px;flex:0 0 52px;border:1px solid var(--rule);background:var(--paper);display:grid;place-items:center;font-family:var(--serif);font-style:italic;font-size:26px;color:var(--accent)}
    .sl-who{font-family:var(--serif);font-size:22px;line-height:1.1;color:var(--ink)}
    .sl-who em{font-style:italic}
    .sl-sub{font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-2);margin-top:8px;line-height:1.7}
    .sl-shelf-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:18px}
    .sl-shelf{aspect-ratio:3/4;position:relative;background:var(--paper);border:1px solid var(--rule-soft);display:grid;place-items:center;overflow:hidden;transition:border-color .3s}
    .sl-shelf::before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(135deg,transparent 0 8px,var(--rule-soft) 8px 9px);opacity:.7}
    .sl-shelf-lbl{position:relative;font-family:var(--mono);font-size:8px;letter-spacing:.14em;color:var(--ink-3)}
    .sl-shelf:hover{border-color:var(--accent)}
    .sl-shelf.add{background:transparent;border-style:dashed;border-color:var(--rule)}
    .sl-shelf.add::before{display:none}
    .sl-shelf.add .sl-shelf-lbl{color:var(--ink-2);font-size:14px}
    .sl-tonight{font-family:var(--serif);font-style:italic;font-weight:400;font-size:22px;line-height:1.22;color:var(--ink);margin:0}
    .sl-tonight em{font-style:italic;color:var(--accent);background:linear-gradient(transparent 70%,var(--accent-soft) 70%);padding:0 .1em}
    .sl-by{display:block;margin-top:12px;font-family:var(--mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-3)}
    .sl-ctas{display:flex;gap:8px;flex-wrap:wrap}
    .sl-btn{display:inline-block;font-family:var(--mono);font-size:9px;letter-spacing:.28em;text-transform:uppercase;padding:13px 18px;border:1px solid var(--rule);color:var(--ink);background:transparent;cursor:pointer;transition:background .25s,color .25s,border-color .25s;text-decoration:none}
    .sl-btn:hover{background:var(--ink);color:var(--paper);border-color:var(--ink)}
    .sl-btn.solid{background:var(--ink);color:var(--paper);border-color:var(--ink)}
    .sl-btn.solid:hover{background:var(--accent);border-color:var(--accent)}
    .sl-btn.ghost{border-color:var(--rule-soft)}

    /* RIGHT */
    .sl-right{padding:56px 0 56px 40px;min-width:0;display:flex;flex-direction:column}
    .sl-channels{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:18px;border-bottom:1px solid var(--rule);gap:32px;flex-wrap:wrap}
    .sl-ch-group{display:flex;gap:28px;align-items:baseline;flex-wrap:wrap}
    .sl-ch{font-family:var(--serif);font-style:italic;font-weight:400;font-size:30px;letter-spacing:-.005em;color:var(--ink-3);cursor:pointer;position:relative;padding:6px 0;background:none;border:0;transition:color .3s}
    .sl-ch:hover{color:var(--ink-2)}
    .sl-ch.on{color:var(--ink)}
    .sl-ch.on::after{content:"";position:absolute;left:0;right:0;bottom:-19px;height:1px;background:var(--accent)}
    .sl-ch-n{font-family:var(--mono);font-style:normal;font-size:9px;letter-spacing:.22em;color:var(--ink-3);margin-left:6px;vertical-align:8px;text-transform:uppercase}
    .sl-ch.on .sl-ch-n{color:var(--accent)}
    .sl-filter{font-family:var(--mono);font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-2);white-space:nowrap;padding-bottom:8px}
    .sl-filter b{color:var(--ink);font-weight:500;border-bottom:1px solid var(--accent);padding-bottom:1px}

    .sl-channel{animation:slFade .5s cubic-bezier(.2,.6,.2,1) both}
    @keyframes slFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .sl-ledger{display:flex;flex-direction:column}
    .sl-entry{display:grid;grid-template-columns:42px 1fr 160px 110px;gap:24px;align-items:flex-start;padding:22px 0;border-bottom:1px solid var(--rule-soft);position:relative;cursor:pointer;transition:background .35s}
    .sl-entry:last-child{border-bottom:none}
    .sl-entry::before{content:"";position:absolute;inset:0;background:var(--accent-soft);opacity:0;transition:opacity .35s;pointer-events:none}
    .sl-entry:hover::before{opacity:1}
    .sl-entry>*{position:relative}
    .sl-entry.with-img{grid-template-columns:42px 180px 1fr 150px 110px}
    .sl-spec{aspect-ratio:3/4;background:var(--paper);border:1px solid var(--rule);position:relative;overflow:hidden}
    .sl-spec::before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(135deg,transparent 0 10px,var(--rule-soft) 10px 11px);opacity:.6}
    .sl-spec-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    .sl-specno,.sl-specsize{position:absolute;font-family:var(--mono);font-size:8px;letter-spacing:.22em;color:var(--ink-3);text-transform:uppercase}
    .sl-specno{top:10px;left:10px}
    .sl-specsize{bottom:10px;left:10px}
    .sl-num{font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--ink-3);padding-top:6px}
    .sl-kind{display:inline-block;font-family:var(--mono);font-size:8px;letter-spacing:.32em;text-transform:uppercase;border:1px solid var(--rule-soft);padding:4px 9px;color:var(--ink-2);margin-bottom:14px}
    .sl-kind.review{border-color:var(--accent);color:var(--accent)}
    .sl-kind.question{border-style:dashed}
    .sl-kind.feature{background:var(--ink);color:var(--paper);border-color:var(--ink)}
    .sl-ttl{font-family:var(--serif);font-style:italic;font-weight:400;font-size:32px;line-height:1.12;margin:0;color:var(--ink);transition:color .3s}
    .sl-entry:hover .sl-ttl{color:var(--accent)}
    .sl-ttl em{font-style:normal;color:var(--accent)}
    .sl-entry:hover .sl-ttl em{color:var(--ink)}
    .sl-excerpt{font-family:var(--sans);font-size:13px;line-height:1.65;color:var(--ink-2);margin-top:10px;max-width:580px}
    .sl-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}
    .sl-tag{font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);border:1px solid var(--rule-soft);padding:4px 9px;border-radius:999px}
    .sl-meta{font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-2);line-height:1.9;text-align:right}
    .sl-meta b{font-weight:500;color:var(--ink);text-transform:none;font-family:var(--serif);font-style:italic;font-size:17px;letter-spacing:0;display:block;margin-bottom:4px}
    .sl-stats{text-align:right;font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3)}
    .sl-big{font-family:var(--serif);font-style:italic;font-weight:400;font-size:42px;line-height:1;color:var(--ink);display:block;margin-bottom:6px;letter-spacing:-.01em}
    .sl-big.accent{color:var(--accent)}
    .sl-stat-row{display:block;line-height:1.7}
    .sl-see-all{display:flex;justify-content:space-between;align-items:center;padding-top:28px;margin-top:8px;gap:20px;flex-wrap:wrap}
    .sl-see-l{font-family:var(--mono);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-2)}
    .sl-see-l b{color:var(--ink);font-weight:500;font-family:var(--serif);font-style:italic;text-transform:none;letter-spacing:0;font-size:18px;margin-right:8px}
    .sl-cta{font-family:var(--serif);font-style:italic;font-size:24px;color:var(--ink);border:0;border-bottom:1px solid var(--accent);padding:0 0 6px;background:none;cursor:pointer;text-decoration:none;transition:color .3s,letter-spacing .3s}
    .sl-cta:hover{color:var(--accent);letter-spacing:.005em}
    .sl-cta .arrow{display:inline-block;transition:transform .3s;font-style:normal}
    .sl-cta:hover .arrow{transform:translateX(6px)}

    /* DRIFT */
    .sl-drift{position:relative;padding:80px 0;border-bottom:1px solid var(--rule);overflow:hidden}
    .sl-drift::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,var(--accent-soft),transparent 60%);pointer-events:none}
    .sl-drift-inner{display:grid;grid-template-columns:1fr 2fr 1fr;gap:48px;align-items:center;position:relative}
    .sl-drift-l,.sl-drift-r{font-family:var(--mono);font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--ink-2);line-height:2}
    .sl-drift-r{text-align:right}
    .sl-drift-l b,.sl-drift-r b{display:block;font-family:var(--serif);font-style:italic;font-weight:400;font-size:42px;color:var(--ink);letter-spacing:-.01em;text-transform:none;line-height:1;margin-bottom:6px}
    .sl-drift-c{text-align:center}
    .sl-drift-c .word{font-family:var(--serif);font-style:italic;font-weight:400;font-size:clamp(64px,9vw,140px);line-height:1;letter-spacing:-.02em;color:var(--ink)}
    .sl-drift-c .word em{color:var(--accent);font-style:normal}
    .sl-drift-c .sub{font-family:var(--mono);font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--ink-2);margin-top:14px}

    @media (max-width:960px){
      .sl-grid{grid-template-columns:1fr}
      .sl-left{position:static;border-right:none;border-bottom:1px solid var(--rule);padding:40px 0}
      .sl-right{padding:40px 0}
      .sl-entry,.sl-entry.with-img{grid-template-columns:32px 1fr;gap:14px}
      .sl-entry .sl-meta,.sl-entry .sl-stats{grid-column:2;text-align:left}
      .sl-entry.with-img .sl-spec{grid-column:2;max-width:160px}
      .sl-below{grid-template-columns:1fr}
      .sl-drift-inner{grid-template-columns:1fr;text-align:center}
      .sl-drift-r{text-align:center}
    }
  `;
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LedgerEntry from '../../../ui/LedgerEntry.jsx';
import ItalicName from '../../../ui/ItalicName.jsx';
import { SALON_THREADS, SALON_ANNOTATIONS, SALON_COUNTS } from '../../../../data/salonStubs.js';

const pad = (i) => String(i + 1).padStart(3, '0');
const parseAccords = (accords) =>
    accords ? String(accords).split(',').map(a => a.trim()).filter(Boolean) : [];

const fragranceUrl = (f) =>
    `/fragrances/${encodeURIComponent(f.brand)}/${encodeURIComponent(f.name)}/${f.id}`;

/**
 * The Home channel switcher (Featured · Salon · Annotations · Houses).
 * Featured/Houses render real data; Salon/Annotations render stubs until
 * the Salon backend exists.
 */
export default function HomeChannels({ fragrances, brands }) {
    const [channel, setChannel] = useState('featured');

    const channels = [
        { id: 'featured', label: 'Featured' },
        { id: 'salon', label: 'Salon', n: SALON_COUNTS.threads },
        { id: 'annotations', label: 'Annotations', n: '1.4k' },
        { id: 'houses', label: 'Houses' },
    ];

    return (
        <main className="col-right">
            <div className="channels">
                <div className="group">
                    {channels.map(c => (
                        <span
                            key={c.id}
                            className={`ch${channel === c.id ? ' on' : ''}`}
                            onClick={() => setChannel(c.id)}
                        >
                            {c.label}
                            {c.n != null && <span className="n">{c.n}</span>}
                        </span>
                    ))}
                </div>
                <div className="filter">— tonight in the archive</div>
            </div>

            {channel === 'featured' && (
                <section className="channel" key="featured">
                    <div className="ledger">
                        {fragrances.map((f, i) => (
                            <LedgerEntry
                                key={f.id || f.name || i}
                                num={pad(i)}
                                kind={{ label: 'Featured', variant: 'feature' }}
                                title={<ItalicName text={f.name} />}
                                tags={parseAccords(f.accords).slice(0, 4)}
                                meta={{ name: f.brand, lines: [f.gender] }}
                                stats={f.year ? { big: f.year, rows: ['released'] } : undefined}
                                image={{ imageUrl: f.imageUrl, alt: f.name, sno: f.id != null ? `№ ${String(f.id).padStart(4, '0')}` : undefined, label: '3 : 4' }}
                                to={fragranceUrl(f)}
                            />
                        ))}
                    </div>
                    <div className="see-all">
                        <div className="lhs">selected at random · refreshed each visit</div>
                        <Link to="/fragrances" className="cta">See all fragrances <span className="arrow">→</span></Link>
                    </div>
                </section>
            )}

            {channel === 'salon' && (
                <section className="channel" key="salon">
                    <div className="ledger">
                        {SALON_THREADS.slice(0, 3).map((t, i) => (
                            <LedgerEntry
                                key={t.id}
                                num={pad(i)}
                                kind={t.kind}
                                title={<ItalicName text={t.title} />}
                                excerpt={t.excerpt}
                                tags={t.tags}
                                meta={t.meta}
                                stats={t.stats}
                                to="/salon"
                            />
                        ))}
                    </div>
                    <div className="see-all">
                        <div className="lhs"><b>{SALON_COUNTS.threads}</b> open threads · {SALON_COUNTS.residencies} perfumers in residence</div>
                        <Link to="/salon" className="cta">See all in Salon <span className="arrow">→</span></Link>
                    </div>
                </section>
            )}

            {channel === 'annotations' && (
                <section className="channel" key="annotations">
                    <div className="ledger">
                        {SALON_ANNOTATIONS.map((a, i) => (
                            <LedgerEntry
                                key={a.id}
                                num={pad(i)}
                                kind={a.kind}
                                title={<ItalicName text={a.title} />}
                                excerpt={a.excerpt}
                                tags={a.tags}
                                meta={a.meta}
                                stats={a.stats}
                                to="/salon"
                            />
                        ))}
                    </div>
                    <div className="see-all">
                        <div className="lhs"><b>{SALON_COUNTS.annotations.toLocaleString()}</b> annotations · across the archive</div>
                        <Link to="/salon" className="cta">Read all annotations <span className="arrow">→</span></Link>
                    </div>
                </section>
            )}

            {channel === 'houses' && (
                <section className="channel" key="houses">
                    <div className="ledger">
                        {brands.map((b, i) => (
                            <LedgerEntry
                                key={b.id || b.name || i}
                                num={pad(i)}
                                kind={{ label: 'House' }}
                                title={<ItalicName text={b.name} />}
                                meta={{ name: b.country || '—', lines: [] }}
                                stats={b.totalFragrances != null ? { big: b.totalFragrances, rows: ['fragrances'] } : undefined}
                                to={`/brands/${encodeURIComponent(b.name)}`}
                            />
                        ))}
                    </div>
                    <div className="see-all">
                        <div className="lhs">selected at random · refreshed each visit</div>
                        <Link to="/brands" className="cta">See all houses <span className="arrow">→</span></Link>
                    </div>
                </section>
            )}
        </main>
    );
}

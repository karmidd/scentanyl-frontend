import React, { useState, useEffect } from 'react';
import PageLayout from '../../primary/PageLayout.jsx';
import Eyebrow from '../../ui/Eyebrow.jsx';
import LedgerEntry from '../../ui/LedgerEntry.jsx';
import ItalicName from '../../ui/ItalicName.jsx';
import {
    SALON_THREADS,
    SALON_ANNOTATIONS,
    TONIGHT_THREAD,
    SALON_COUNTS,
} from '../../../data/salonStubs.js';
import './SalonPage.css';

const CHANNELS = [
    { id: 'all', label: 'Everything' },
    { id: 'threads', label: 'Threads' },
    { id: 'questions', label: 'Questions' },
    { id: 'annotations', label: 'Annotations' },
];

const RESIDENTS = [
    { name: 'Frédéric Malle', status: 'open Q&A · until Thu', on: true },
    { name: 'Christine Nagel', status: 'archived session' },
    { name: 'Jacques Cavallier', status: 'archived session' },
];

/**
 * The Salon — the members' journal (DESIGN_SYSTEM.md §10). Forum-only:
 * threads, questions, annotations, perfumer residencies. Everything below
 * renders from salonStubs.js until the community backend exists.
 */
const SalonPage = () => {
    const [channel, setChannel] = useState('all');

    useEffect(() => {
        document.title = 'The Salon | Scentanyl';
    }, []);

    const threads = SALON_THREADS.filter(t => !t.kind.variant);
    const questions = SALON_THREADS.filter(t => t.kind.variant === 'question');

    const entries =
        channel === 'threads' ? threads
        : channel === 'questions' ? questions
        : channel === 'annotations' ? SALON_ANNOTATIONS
        : [...SALON_THREADS, ...SALON_ANNOTATIONS];

    const { question, emphasis, by } = TONIGHT_THREAD;
    const [before, after] = question.split(emphasis);

    return (
        <PageLayout headerNum={6} fullBleed>
            <div className="stage">
                <section className="sl-hero">
                    <div className="issue">
                        <span>— The Salon · members' journal</span>
                        <span>annotations · marginalia · residencies</span>
                        <span>quiet, considered, unhurried</span>
                    </div>
                    <h1>The <em>Salon.</em></h1>
                    <div className="below">
                        <p className="lede">
                            A private members' journal for perfumery — long-form annotations, open
                            threads, and perfumers in residence. Bring an opinion; leave with three.
                        </p>
                        <div className="figures">
                            <b>{SALON_COUNTS.threads}</b> open threads<br />
                            <b>{SALON_COUNTS.annotations.toLocaleString()}</b> annotations<br />
                            <b>{SALON_COUNTS.residencies}</b> perfumers in residence
                        </div>
                    </div>
                </section>

                <div className="sl-grid">
                    <main className="sl-main">
                        <div className="channels">
                            <div className="group">
                                {CHANNELS.map(c => (
                                    <span
                                        key={c.id}
                                        className={`ch${channel === c.id ? ' on' : ''}`}
                                        onClick={() => setChannel(c.id)}
                                    >
                                        {c.label}
                                    </span>
                                ))}
                            </div>
                            <div className="filter">Sorted by recent activity</div>
                        </div>

                        <section className="channel" key={channel}>
                            <div className="ledger">
                                {entries.map((entry, i) => (
                                    <LedgerEntry
                                        key={entry.id}
                                        num={String(i + 1).padStart(3, '0')}
                                        kind={entry.kind}
                                        title={<ItalicName text={entry.title} />}
                                        excerpt={entry.excerpt}
                                        tags={entry.tags}
                                        meta={entry.meta}
                                        stats={entry.stats}
                                    />
                                ))}
                            </div>
                            <div className="see-all">
                                <div className="lhs">preview entries · the full ledger arrives with membership</div>
                            </div>
                        </section>
                    </main>

                    <aside className="sl-rail">
                        <div className="block">
                            <Eyebrow right="open thread">Tonight in the Salon</Eyebrow>
                            <p className="tonight">{before}<em>{emphasis}</em>{after}</p>
                            <span className="tonight-by">{by}</span>
                        </div>

                        <div className="block">
                            <Eyebrow right={`${SALON_COUNTS.residencies} total`}>Perfumers in residence</Eyebrow>
                            <div className="residents">
                                {RESIDENTS.map(r => (
                                    <div className="res" key={r.name}>
                                        <span className="nm">{r.name}</span>
                                        <span className={`st${r.on ? ' on' : ''}`}>{r.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="block">
                            <Eyebrow right="the spirit">House rules</Eyebrow>
                            <p className="rules">
                                <em>Annotations, not comments.</em><br />
                                Write about a bottle you have lived with, not one you have smelled on paper.
                                No ratings out of ten. No buy-now urgency. Marginalia are welcome;
                                pile-ons are not. Disagree like it's a dinner table.
                            </p>
                        </div>

                        <div className="block">
                            <Eyebrow right="members only" style={{ marginBottom: 14 }}>Contribute</Eyebrow>
                            <div className="ctas">
                                <button type="button" className="btn ghost" disabled>Write a review</button>
                                <button type="button" className="btn ghost" disabled>Open a thread</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <section className="sl-membership">
                <div className="t">The Salon opens <em>soon.</em></div>
                <div className="sub">membership ledger in preparation · the entries above are a preview of the form</div>
            </section>
        </PageLayout>
    );
};

export default SalonPage;

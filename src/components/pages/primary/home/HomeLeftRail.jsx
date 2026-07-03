import React from 'react';
import { Link } from 'react-router-dom';
import Eyebrow from '../../../ui/Eyebrow.jsx';
import RandomFragranceButton from '../../../utils/buttons/RandomFragranceButton.jsx';
import { TONIGHT_THREAD } from '../../../../data/salonStubs.js';

/** Sticky brand-voice column: manifesto, member card, tonight's thread, contribute. */
export default function HomeLeftRail() {
    const { question, emphasis, by } = TONIGHT_THREAD;
    const [before, after] = question.split(emphasis);

    return (
        <aside className="col-left">
            <div className="block manifesto">
                <Eyebrow right="Vol. I">Manifesto</Eyebrow>
                <h2>Of <em>scent,</em> in earnest.</h2>
                <p className="body">Two thousand houses. Twenty-one thousand bottles. One quiet place to walk through them all.</p>
                <p className="body notitalic">No buy-now urgency. Only an index kept with care, and annotations written by members who have lived with a bottle long enough to mean it.</p>
            </div>

            <div className="block">
                <Eyebrow right="salon preview">Member</Eyebrow>
                <div className="member">
                    <div className="avatar">N</div>
                    <div>
                        <div className="who">Anonymous <em>Nose</em></div>
                        <div className="sub">12 annotations · 47 saved<br />3 shelves · prefers oud, iris</div>
                    </div>
                </div>
                <div className="shelf-strip">
                    <div className="shelf"><span className="lbl">01 · 3:4</span></div>
                    <div className="shelf"><span className="lbl">02 · 3:4</span></div>
                    <div className="shelf"><span className="lbl">03 · 3:4</span></div>
                    <div className="shelf"><span className="lbl">04 · 3:4</span></div>
                    <div className="shelf add"><span className="lbl">+</span></div>
                </div>
                <Eyebrow style={{ marginTop: 14, marginBottom: 0 }} right="4 of 12">Your shelf</Eyebrow>
            </div>

            <div className="block">
                <Eyebrow right="open thread">Tonight in the Salon</Eyebrow>
                <p className="tonight">{before}<em>{emphasis}</em>{after}</p>
                <span className="tonight-by">{by}</span>
                <div className="ctas" style={{ marginTop: 20 }}>
                    <Link to="/salon" className="btn solid">Annotate</Link>
                    <Link to="/salon" className="btn">Read salon →</Link>
                </div>
            </div>

            <div className="block">
                <Eyebrow right="members only" style={{ marginBottom: 14 }}>Contribute</Eyebrow>
                <div className="ctas">
                    <Link to="/salon" className="btn ghost">Write a review</Link>
                    <Link to="/salon" className="btn ghost">Open a thread</Link>
                    <RandomFragranceButton className="btn ghost" />
                </div>
            </div>
        </aside>
    );
}

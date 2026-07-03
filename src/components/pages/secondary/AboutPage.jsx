import React from 'react';
import ProsePage from './ProsePage.jsx';

export default function AboutPage() {
    return (
        <ProsePage
            docTitle="About | Scentanyl"
            eyebrow="From the founder"
            eyebrowRight="est. 2023"
            title="About Scentanyl."
        >
            <p className="lede">
                "I started my fragrance journey in the fall of 2023. Like many newcomers, I dove
                deep — exploring scent profiles, following releases, and slowly building a collection."
            </p>
            <p>
                But as I searched for a place to keep up with the fragrance world, I noticed something
                frustrating: most websites felt outdated, cluttered, or just not built with the user in
                mind. They lacked the clean, modern experience I was looking for. Still, I found myself
                relying on them simply because there were no better alternatives.
            </p>
            <p>
                That's why I created <strong>Scentanyl</strong> — a fragrance platform built from the
                ground up with simplicity, clarity, and modern design at its core. It's a place where
                you can explore fragrances, brands, notes, and more without being overwhelmed.
            </p>
            <div className="sig">— Founder &amp; Developer of Scentanyl</div>
            <p>
                Scentanyl aims to achieve one goal: to give fragrance lovers a seamless and elegant way
                to discover what they're looking for. Whether you're just beginning or deep in the world
                of perfume, Scentanyl is made for you.
            </p>
        </ProsePage>
    );
}

import React from 'react';
import ProsePage from './ProsePage.jsx';

export default function ContactPage() {
    return (
        <ProsePage
            docTitle="Contact Us | Scentanyl"
            eyebrow="Correspondence"
            eyebrowRight="48h reply"
            title="Write to us."
        >
            <p className="lede">
                Whether you're a house looking to be featured, an enthusiast noticing a missing scent,
                or have any business inquiries — we'd love to hear from you.
            </p>
            <p>Get in touch for:</p>
            <ul>
                <li>Adding your brand or fragrances to our database</li>
                <li>Reporting missing or incorrect fragrance information</li>
                <li>Business partnerships and collaborations</li>
                <li>Technical issues or suggestions</li>
                <li>General feedback and feature requests</li>
            </ul>
            <a className="contact-line" href="mailto:contact@scentanyl.com">contact@scentanyl.com</a>
            <p>
                We aim to respond to all inquiries within 48 hours. Thank you for helping us make
                Scentanyl the best fragrance discovery platform.
            </p>
        </ProsePage>
    );
}

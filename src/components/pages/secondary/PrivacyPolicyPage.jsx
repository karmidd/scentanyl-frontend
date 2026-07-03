import React from 'react';
import ProsePage from './ProsePage.jsx';

export default function PrivacyPolicyPage() {
    return (
        <ProsePage
            docTitle="Privacy Policy | Scentanyl"
            eyebrow="Privacy"
            eyebrowRight="last updated · July 30, 2025"
            title="Privacy policy."
        >
            <p className="lede">
                At Scentanyl, we respect your privacy. This website does not collect personal
                information, does not use cookies, and does not track users.
            </p>
            <p>What we don't do:</p>
            <ul>
                <li>We do not collect names, emails, or other personal details.</li>
                <li>We do not require user accounts or logins.</li>
                <li>We do not use cookies or third-party trackers.</li>
                <li>We do not display advertisements.</li>
            </ul>
        </ProsePage>
    );
}

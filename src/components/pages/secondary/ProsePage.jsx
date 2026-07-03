import React, { useEffect } from 'react';
import PageLayout from '../../primary/PageLayout.jsx';
import Eyebrow from '../../ui/Eyebrow.jsx';
import PageHero from '../../ui/PageHero.jsx';
import './ProsePage.css';

/**
 * Editorial prose shell for the house pages (About / Contact / Privacy):
 * masthead + a hairline-ruled article column.
 */
export default function ProsePage({ docTitle, eyebrow, eyebrowRight, title, titleItalic, children }) {
    useEffect(() => {
        document.title = docTitle;
    }, [docTitle]);

    return (
        <PageLayout headerNum={-1}>
            <PageHero title={title} titleItalic={titleItalic} />
            <article className="prose">
                <Eyebrow right={eyebrowRight}>{eyebrow}</Eyebrow>
                {children}
            </article>
        </PageLayout>
    );
}

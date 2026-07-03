import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../primary/PageLayout.jsx';
import './errors.css';

export default function NotFoundPage({ headerNum, mainMessage, secondaryMessage }) {
    const navigate = useNavigate();
    return (
        <PageLayout headerNum={headerNum}>
            <div className="err">
                <div className="code">Not <em>found.</em></div>
                <div className="t">{mainMessage}</div>
                <div className="sub">{secondaryMessage}</div>
                <div className="row">
                    <button type="button" className="btn" onClick={() => navigate(-1)}>← Go back</button>
                    <button type="button" className="btn solid" onClick={() => navigate('/')}>To the archive</button>
                </div>
            </div>
        </PageLayout>
    );
}

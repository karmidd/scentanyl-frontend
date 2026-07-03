import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../primary/PageLayout.jsx';
import './errors.css';

const ErrorPage404 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "404 - Page Not Found | Scentanyl";
    }, []);

    return (
        <PageLayout headerNum={-1}>
            <div className="err">
                <div className="code">4<em>0</em>4</div>
                <div className="t">Page not found</div>
                <div className="sub">the page you're looking for isn't in the archive</div>
                <div className="row">
                    <button type="button" className="btn solid" onClick={() => navigate('/')}>
                        To the archive
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default ErrorPage404;

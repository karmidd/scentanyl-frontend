import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../primary/PageLayout.jsx';
import './errors.css';

const ErrorPage429 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "429 - Rate Limit Reached | Scentanyl";
    }, []);

    return (
        <PageLayout headerNum={-1}>
            <div className="err">
                <div className="code">4<em>2</em>9</div>
                <div className="t">Without hurry, please</div>
                <div className="sub">you've made too many requests — wait a moment and try again</div>
                <div className="row">
                    <button type="button" className="btn solid" onClick={() => navigate('/')}>
                        To the archive
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default ErrorPage429;

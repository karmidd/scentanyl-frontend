import React, { useState, useEffect } from 'react';
import LoadingPage from './LoadingPage.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';
import HomeHero from './home/HomeHero.jsx';
import HomeLeftRail from './home/HomeLeftRail.jsx';
import HomeChannels from './home/HomeChannels.jsx';
import './HomePage.css';

const HomePage = () => {
    const [featuredFragrances, setFeaturedFragrances] = useState([]);
    const [featuredBrands, setFeaturedBrands] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchFeaturedFragrances = async () => {
            try {
                setLoading(true);
                const response = await apiFetch(`${API_BASE_URL}/api/random-frag?count=4`);
                if (!response.ok) throw new Error('Failed to fetch fragrances');
                const fragrances = await response.json();
                setFeaturedFragrances(fragrances);
            } catch (error) {
                console.error('Error fetching fragrances:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedFragrances();
    }, []);

    useEffect(() => {
        const fetchFeaturedBrands = async () => {
            try {
                setLoading(true);
                const response = await apiFetch(`${API_BASE_URL}/api/random-brand?count=4`);
                if (!response.ok) throw new Error('Failed to fetch brands');
                const brands = await response.json();
                setFeaturedBrands(brands);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedBrands();
    }, []);

    // Archive figures for the masthead / drift band (best-effort; hidden if unavailable)
    useEffect(() => {
        apiFetch(`${API_BASE_URL}/api/fragrances/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching stats:', err));
    }, [API_BASE_URL]);

    if (loading) {
        return <LoadingPage />;
    }

    const fragranceCount = stats?.genderCounts?.all || 0;
    const yearSpan = stats?.minYear && stats?.maxYear ? stats.maxYear - stats.minYear : null;

    return (
        <PageLayout headerNum={0} fullBleed>
            <div className="stage">
                <HomeHero fragranceCount={fragranceCount} specimen={featuredFragrances[0]} />
                <div className="salon-grid">
                    <HomeLeftRail />
                    <HomeChannels fragrances={featuredFragrances} brands={featuredBrands} />
                </div>
            </div>

            <section className="drift">
                <div className="drift-inner">
                    <div className="l">
                        {fragranceCount > 0 && <b>{fragranceCount.toLocaleString()}</b>}
                        fragrances catalogued
                        <br />indexing in progress
                    </div>
                    <div className="center">
                        <div className="word"><em>—</em> get addicted <em>—</em></div>
                        <div className="sub">then write it down</div>
                    </div>
                    <div className="r">
                        {yearSpan && <b>{yearSpan}</b>}
                        years of perfumery
                        <br />{stats?.minYear ? `${stats.minYear} — ${stats.maxYear}` : 'archive in progress'}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default HomePage;

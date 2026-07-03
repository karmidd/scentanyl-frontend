import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingPage from '../primary/LoadingPage.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import NotFoundPage from '../secondary/errors/NotFoundPage.jsx';
import Breadcrumb from '../../ui/Breadcrumb.jsx';
import ImageSlot from '../../ui/ImageSlot.jsx';
import ItalicName from '../../ui/ItalicName.jsx';
import MetaTable from '../../ui/MetaTable.jsx';
import GenderMark from '../../ui/GenderMark.jsx';
import NotePyramid from '../../ui/NotePyramid.jsx';
import RandomFragranceButton from '../../utils/buttons/RandomFragranceButton.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';
import './FragrancePage.css';

const titleCase = (s) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const FragrancePage = () => {
    const { brand, name, id } = useParams();
    const [fragrance, setFragrance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        error ? document.title = "Fragrance Not Found | Scentanyl" : document.title = `${name} by ${brand} | Scentanyl`;
    }, [brand, name, error]);

    useEffect(() => {
        const fetchFragrance = async () => {
            try {
                setLoading(true);
                const response = await apiFetch(`${API_BASE_URL}/api/fragrances/${encodeURIComponent(brand)}/${encodeURIComponent(name)}/${id}`);
                if (!response.ok) {
                    throw new Error(`Fragrance "${name}" from the brand "${brand}" not found`);
                }
                const data = await response.json();
                if (!data || !data.name) {
                    throw new Error(`Fragrance "${name}" from the brand "${brand}" wasn't found`);
                }
                setFragrance(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFragrance();
    }, [brand, name, id]);

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return (
            <NotFoundPage headerNum={1} mainMessage={"Fragrance Not Found"} secondaryMessage={"Are you sure the URL is correct? If yes, send us a message and we'll sort this out!"} />
        );
    }

    const parseList = (value) => {
        if (!value) return [];
        return String(value).split(',').map(item => item.trim()).filter(Boolean);
    };

    const perfumers = fragrance?.perfumerNames
        ? [...new Set(String(fragrance.perfumerNames).replaceAll(' | ', ',').split(',').map(p => p.trim()).filter(Boolean))]
        : [];

    const accords = parseList(fragrance?.accords);

    const tiers = [
        fragrance?.topNotes && {
            key: 'top', kicker: 'Top notes', name: 'The opening',
            desc: 'First spray — bright and aromatic, before anything settles.',
            notes: parseList(fragrance.topNotes),
        },
        fragrance?.middleNotes && {
            key: 'middle', kicker: 'Heart notes', name: 'The soul', heart: true,
            desc: 'The character of the scent, blooming as the top fades.',
            notes: parseList(fragrance.middleNotes),
        },
        fragrance?.baseNotes && {
            key: 'base', kicker: 'Base notes', name: 'The dry-down',
            desc: 'What lingers, hours later — close to the skin.',
            notes: parseList(fragrance.baseNotes),
        },
        fragrance?.uncategorizedNotes && {
            key: 'uncategorized', kicker: 'Uncategorized', name: 'The rest',
            desc: 'Noted in the record without a tier.',
            notes: parseList(fragrance.uncategorizedNotes),
        },
    ].filter(Boolean);

    const metaRows = [
        { k: 'House', v: <Link to={`/brands/${encodeURIComponent(fragrance.brand)}`}>{fragrance.brand}</Link> },
        perfumers.length > 0 && {
            k: perfumers.length > 1 ? 'Perfumers' : 'Perfumer',
            v: perfumers.map((p, i) => {
                const clickable = p.toLowerCase() !== 'n/a';
                return (
                    <React.Fragment key={i}>
                        {clickable
                            ? <Link to={`/perfumers/${encodeURIComponent(p)}`}>{p}</Link>
                            : p}
                        {i < perfumers.length - 1 && ', '}
                    </React.Fragment>
                );
            }),
        },
        fragrance?.year && { k: 'Released', v: fragrance.year },
        fragrance?.gender && { k: 'Gender', v: <GenderMark gender={fragrance.gender} /> },
        accords.length > 0 && {
            k: 'Accords',
            v: (
                <span className="accord-pills">
                    {accords.map((accord, i) => (
                        <Link key={i} className="pill" to={`/accords/${encodeURIComponent(accord)}`}>
                            {titleCase(accord)}
                        </Link>
                    ))}
                </span>
            ),
        },
    ];

    return (
        <PageLayout headerNum={1}>
            <Breadcrumb
                style={{ paddingTop: 30 }}
                items={[
                    { label: 'Fragrances', to: '/fragrances' },
                    { label: fragrance.brand, to: `/brands/${encodeURIComponent(fragrance.brand)}` },
                    { label: fragrance.name },
                ]}
            />

            <section className="specimen">
                <div className="img-col">
                    <ImageSlot
                        imageUrl={fragrance.imageUrl}
                        alt={`${fragrance.name} by ${fragrance.brand}`}
                        ratio="4/5"
                        sno={`№ ${String(fragrance.id ?? id).padStart(4, '0')} · specimen`}
                        label="bottle · 4:5"
                    />
                    <div className="cap">
                        <span>{fragrance.imageUrl ? 'Image courtesy of Fragrantica' : 'Awaiting photography'}</span>
                        {fragrance.imageUrl && (
                            <a href={fragrance.imageUrl} target="_blank" rel="noopener noreferrer">⤴ View original</a>
                        )}
                    </div>
                </div>

                <div className="info-col">
                    <div className="specno">Specimen № {String(fragrance.id ?? id).padStart(4, '0')}</div>
                    <h1><ItalicName text={fragrance.name} /></h1>
                    <div className="byline">
                        by <Link to={`/brands/${encodeURIComponent(fragrance.brand)}`}>{fragrance.brand}</Link>
                    </div>
                    <MetaTable rows={metaRows} />
                    <div className="actions">
                        <RandomFragranceButton className="btn solid">Random discovery ⤳</RandomFragranceButton>
                        <button type="button" className="btn" onClick={() => navigate('/fragrances')}>
                            ← All fragrances
                        </button>
                    </div>
                </div>
            </section>

            <NotePyramid tiers={tiers} />

            <section className="frag-more">
                <div className="t">Explore more fragrances</div>
                <div className="sub">the archive keeps going · indexing in progress</div>
                <div className="row">
                    <button type="button" className="btn" onClick={() => navigate('/fragrances')}>
                        ← Back to all fragrances
                    </button>
                    <RandomFragranceButton className="btn solid">Random discovery ⤳</RandomFragranceButton>
                </div>
            </section>
        </PageLayout>
    );
};

export default FragrancePage;

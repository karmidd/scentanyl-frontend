import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../primary/LoadingPage.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import NotFoundPage from '../secondary/errors/NotFoundPage.jsx';
import Breadcrumb from '../../ui/Breadcrumb.jsx';
import PageHero from '../../ui/PageHero.jsx';
import StatsBand from '../../ui/StatsBand.jsx';
import SearchLine from '../../ui/SearchLine.jsx';
import Seg from '../../ui/Seg.jsx';
import ResultsLine from '../../ui/ResultsLine.jsx';
import CatalogueGrid from '../../ui/CatalogueGrid.jsx';
import FragranceCatCard from '../../ui/FragranceCatCard.jsx';
import LoadMoreRow from '../../ui/LoadMoreRow.jsx';
import EmptyState from '../../ui/EmptyState.jsx';
import Composer from '../../ui/Composer.jsx';
import FragranceFilterBar from '../fragrances/FragranceFilterBar.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

const MemoizedFragranceCatCard = memo(FragranceCatCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const PAGE_SIZE = 50;

/**
 * Shared detail page for a note or an accord: the fragrances that feature it,
 * server-paginated with search / gender / year / advanced-search filters
 * (and, for notes, the pyramid-position filter).
 */
export default function TaggedFragrancesPage({
    value,               // the note/accord name from the route
    endpointBase,        // '/api/notes' | '/api/accords'
    headerNum,
    kindLabel,           // 'Note' | 'Accord'
    listRoute,           // '/notes' | '/accords'
    listLabel,           // 'Notes' | 'Accords'
    statsInit,
    statsToBand,         // (stats) => StatsBand items
    statsToYears,        // (stats) => [minYear, maxYear]
    withPositionFilter = false,
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [composerOpen, setComposerOpen] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const [fragrances, setFragrances] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const [selectedPosition, setSelectedPosition] = useState('all');
    const [yearRange, setYearRange] = useState(null);
    const [yearSort, setYearSort] = useState('none');
    const [advancedSearchData, setAdvancedSearchData] = useState({
        mode: 'regular',
        accords: [],
        excludedAccords: [],
        notes: { top: [], middle: [], base: [], uncategorized: [] },
        excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
    });
    const [stats, setStats] = useState(statsInit);

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const pretty = value.split(/(\s|\(|\))/).map(w => /^[a-zA-Z]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w).join('');
        error
            ? document.title = `${kindLabel} Not Found | Scentanyl`
            : document.title = `${pretty} ${kindLabel} | Scentanyl`;
    }, [value, error, kindLabel]);

    useEffect(() => {
        if (value) {
            apiFetch(`${API_BASE_URL}${endpointBase}/${encodeURIComponent(value)}/stats`)
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(err => console.error(`Error fetching ${kindLabel.toLowerCase()} stats:`, err));
        }
    }, [API_BASE_URL, endpointBase, value, kindLabel]);

    const fetchFragrances = useCallback(async (pageNum, append = false) => {
        try {
            const params = new URLSearchParams({
                page: pageNum,
                size: PAGE_SIZE,
                ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
                ...(selectedGender !== 'all' && { gender: selectedGender }),
                ...(withPositionFilter && selectedPosition !== 'all' && { position: selectedPosition }),
                ...(yearRange && {
                    minYear: yearRange[0],
                    maxYear: yearRange[1]
                }),
                ...(yearSort !== 'none' && {
                    sortBy: 'year',
                    sortDirection: yearSort === 'newest' ? 'DESC' : 'ASC'
                }),
                ...(advancedSearchData.mode !== 'regular' && {
                    advancedMode: advancedSearchData.mode,
                    ...(advancedSearchData.accords.length > 0 && { accords: advancedSearchData.accords.join(',') }),
                    ...(advancedSearchData.excludedAccords.length > 0 && { excludedAccords: advancedSearchData.excludedAccords.join(',') }),
                    ...(advancedSearchData.mode === 'layered' && {
                        topNotes: advancedSearchData.notes.top.join(','),
                        middleNotes: advancedSearchData.notes.middle.join(','),
                        baseNotes: advancedSearchData.notes.base.join(','),
                        excludedTopNotes: advancedSearchData.excludedNotes.top.join(','),
                        excludedMiddleNotes: advancedSearchData.excludedNotes.middle.join(','),
                        excludedBaseNotes: advancedSearchData.excludedNotes.base.join(',')
                    }),
                    ...(advancedSearchData.mode === 'uncategorized' && {
                        notes: advancedSearchData.notes.uncategorized.join(','),
                        excludedNotes: advancedSearchData.excludedNotes.uncategorized.join(',')
                    })
                })
            });

            const response = await apiFetch(`${API_BASE_URL}${endpointBase}/${encodeURIComponent(value)}?${params}`);

            if (!response.ok) {
                throw new Error(`${kindLabel} "${value}" not found`);
            }

            const data = await response.json();

            if (append) {
                setFragrances(prev => [...prev, ...data.content]);
            } else {
                setFragrances(data.content);
            }

            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error(`Error fetching ${kindLabel.toLowerCase()} fragrances:`, error);
            setError(error.message);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [API_BASE_URL, endpointBase, value, kindLabel, debouncedSearchQuery, selectedGender, selectedPosition, withPositionFilter, yearRange, yearSort, advancedSearchData]);

    useEffect(() => {
        setPage(0);
        fetchFragrances(0, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchQuery, selectedPosition, selectedGender, yearRange, yearSort, advancedSearchData.mode, advancedSearchData.accords.length, advancedSearchData.excludedAccords.length,
        JSON.stringify(advancedSearchData.notes),
        JSON.stringify(advancedSearchData.excludedNotes)]);

    const loadMore = useCallback(() => {
        if (page < totalPages - 1 && !isLoadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFragrances(nextPage, true);
        }
    }, [page, totalPages, isLoadingMore, fetchFragrances]);

    const hasMore = page < totalPages - 1;

    const handleSearch = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleAdvancedSearchChange = useCallback((newAdvancedSearchData) => {
        setAdvancedSearchData(newAdvancedSearchData);
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return (
            <NotFoundPage
                headerNum={headerNum}
                mainMessage={`${kindLabel} Not Found`}
                secondaryMessage={`The ${kindLabel.toLowerCase()} "${value}" could not be found or has no fragrances.`}
            />
        );
    }

    const [minYear, maxYear] = statsToYears(stats);

    return (
        <PageLayout headerNum={headerNum}>
            <Breadcrumb
                style={{ paddingTop: 30 }}
                items={[
                    { label: listLabel, to: listRoute },
                    { label: value },
                ]}
            />

            <PageHero
                title={`${value}.`}
                sub={totalElements.toLocaleString()}
                subLines={[`fragrances carry this ${kindLabel.toLowerCase()}`]}
            />

            <StatsBand items={statsToBand(stats)} />

            <SearchLine
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
                placeholder="Search fragrances, brands, or accords…"
            />

            <FragranceFilterBar
                selectedGender={selectedGender}
                onGenderChange={setSelectedGender}
                minYear={minYear}
                maxYear={maxYear}
                yearRange={yearRange}
                onYearRangeChange={setYearRange}
                yearSort={yearSort}
                onYearSortChange={setYearSort}
                advancedSearchData={advancedSearchData}
                onAdvancedSearchChange={handleAdvancedSearchChange}
                onOpenComposer={() => setComposerOpen(true)}
            />

            {withPositionFilter && (
                <div className="filter-bar" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <div className="fb-group">
                        <span className="lbl">Position</span>
                        <Seg
                            value={selectedPosition}
                            onChange={setSelectedPosition}
                            options={[
                                { value: 'all', label: 'Anywhere' },
                                { value: 'top', label: 'Top' },
                                { value: 'middle', label: 'Heart' },
                                { value: 'base', label: 'Base' },
                                { value: 'uncategorized', label: 'Uncategorized' },
                            ]}
                        />
                    </div>
                </div>
            )}

            <ResultsLine shown={fragrances.length} total={totalElements} type="fragrances" />

            {fragrances.length > 0 ? (
                <>
                    <CatalogueGrid>
                        {fragrances.map((fragrance, index) => (
                            <MemoizedFragranceCatCard
                                key={fragrance.id}
                                fragrance={fragrance}
                                index={index}
                                highlightAccords={advancedSearchData.accords}
                            />
                        ))}
                    </CatalogueGrid>
                    {hasMore && (
                        <LoadMoreRow
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            label="↓ Load more fragrances"
                            note={`${fragrances.length.toLocaleString()} of ${totalElements.toLocaleString()}`}
                        />
                    )}
                </>
            ) : (
                <EmptyState
                    big="No fragrances found."
                    small={advancedSearchData.mode !== 'regular'
                        ? 'try adjusting your selected notes, accords, or filters'
                        : 'try adjusting your search terms or filters'}
                />
            )}

            <section className="frag-more">
                <div className="t">Explore more {listLabel.toLowerCase()}</div>
                <div className="row">
                    <button type="button" className="btn" onClick={() => navigate(listRoute)}>
                        ← Back to all {listLabel.toLowerCase()}
                    </button>
                </div>
            </section>

            <Composer
                open={composerOpen}
                onClose={() => setComposerOpen(false)}
                value={advancedSearchData}
                onChange={handleAdvancedSearchChange}
            />
        </PageLayout>
    );
}

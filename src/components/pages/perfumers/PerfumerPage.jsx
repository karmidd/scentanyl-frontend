import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from '../primary/LoadingPage.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import NotFoundPage from '../secondary/errors/NotFoundPage.jsx';
import Breadcrumb from '../../ui/Breadcrumb.jsx';
import PageHero from '../../ui/PageHero.jsx';
import StatsBand from '../../ui/StatsBand.jsx';
import SearchLine from '../../ui/SearchLine.jsx';
import ResultsLine from '../../ui/ResultsLine.jsx';
import CatalogueGrid from '../../ui/CatalogueGrid.jsx';
import FragranceCatCard from '../../ui/FragranceCatCard.jsx';
import LoadMoreRow from '../../ui/LoadMoreRow.jsx';
import EmptyState from '../../ui/EmptyState.jsx';
import Composer from '../../ui/Composer.jsx';
import FragranceFilterBar from '../fragrances/FragranceFilterBar.jsx';
import { useFragranceFilter } from '../../../hooks/useFragranceFilter.jsx';
import { usePagination } from '../../../hooks/usePagination.jsx';
import { useYearRange } from '../../../hooks/useYearRange.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

const MemoizedFragranceCatCard = memo(FragranceCatCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const PerfumerPage = () => {
    const navigate = useNavigate();
    const { perfumer } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [composerOpen, setComposerOpen] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        error ? document.title = "Perfumer Not Found | Scentanyl" : document.title = `${perfumer} | Scentanyl`;
    }, [perfumer, error]);

    // Use custom hooks
    const {
        fragrances,
        setFragrances,
        filteredFragrances,
        searchQuery,
        setSearchQuery,
        selectedGender,
        setSelectedGender,
        advancedSearchData,
        setAdvancedSearchData,
        genderCounts,
        yearRange,
        setYearRange,
        yearSort,
        setYearSort
    } = useFragranceFilter();

    // Calculate year range from fragrances
    const [minYear, maxYear] = useYearRange(fragrances);

    const {
        displayedItems: displayedFragrances,
        hasMore,
        isLoadingMore,
        loadMore,
        reset: resetPagination
    } = usePagination(filteredFragrances, 20);

    useEffect(() => {
        if (perfumer) {
            fetchPerfumerData();
        }
    }, [perfumer]);

    // Reset pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [searchQuery, selectedGender, advancedSearchData, yearRange, yearSort, resetPagination]);

    const fetchPerfumerData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiFetch(`${API_BASE_URL}/api/perfumers/${encodeURIComponent(perfumer)}`);

            if (!response.ok) {
                throw new Error('Perfumer not found');
            }

            const fragrancesData = await response.json();
            if (!fragrancesData || (Array.isArray(fragrancesData) && fragrancesData.length === 0)) {
                throw new Error('No fragrances found for this perfumer');
            }
            setFragrances(fragrancesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching perfumer data:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    // Memoized callbacks
    const handleSearch = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    const handleAdvancedSearchChange = useCallback((newAdvancedSearchData) => {
        setAdvancedSearchData(newAdvancedSearchData);
    }, [setAdvancedSearchData]);

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return (
            <NotFoundPage headerNum={5} mainMessage={"Perfumer Not Found"} secondaryMessage={`The perfumer "${perfumer}" could not be found or has no fragrances.`} />
        );
    }

    return (
        <PageLayout headerNum={5}>
            <Breadcrumb
                style={{ paddingTop: 30 }}
                items={[
                    { label: 'Perfumers', to: '/perfumers' },
                    { label: perfumer },
                ]}
            />

            <PageHero
                title={`${perfumer}.`}
                sub={genderCounts.all.toLocaleString()}
                subLines={[genderCounts.all === 1 ? 'fragrance composed' : 'fragrances composed']}
            />

            <StatsBand items={[
                { value: genderCounts.all, label: 'total fragrances', accent: true },
                { value: genderCounts.men, label: "men's" },
                { value: genderCounts.women, label: "women's" },
                { value: genderCounts.unisex, label: 'unisex' },
            ]} />

            <SearchLine
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
                placeholder="Search fragrances, brands, notes, or accords…"
            />

            <FragranceFilterBar
                selectedGender={selectedGender}
                onGenderChange={setSelectedGender}
                genderCounts={genderCounts}
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

            <ResultsLine shown={displayedFragrances.length} total={filteredFragrances.length} type="fragrances" />

            {displayedFragrances.length > 0 ? (
                <>
                    <CatalogueGrid>
                        {displayedFragrances.map((fragrance, index) => (
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
                            note={`${displayedFragrances.length} of ${filteredFragrances.length.toLocaleString()}`}
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
                <div className="t">Explore more perfumers</div>
                <div className="row">
                    <button type="button" className="btn" onClick={() => navigate('/perfumers')}>
                        ← Back to all perfumers
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
};

export default PerfumerPage;

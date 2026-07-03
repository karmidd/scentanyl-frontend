import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from '../primary/LoadingPage.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import NotFoundPage from '../secondary/errors/NotFoundPage.jsx';
import Breadcrumb from '../../ui/Breadcrumb.jsx';
import PageHero from '../../ui/PageHero.jsx';
import SearchLine from '../../ui/SearchLine.jsx';
import ResultsLine from '../../ui/ResultsLine.jsx';
import CatalogueGrid from '../../ui/CatalogueGrid.jsx';
import FragranceCatCard from '../../ui/FragranceCatCard.jsx';
import LoadMoreRow from '../../ui/LoadMoreRow.jsx';
import EmptyState from '../../ui/EmptyState.jsx';
import Composer from '../../ui/Composer.jsx';
import FragranceFilterBar from '../fragrances/FragranceFilterBar.jsx';
import { usePagination } from '../../../hooks/usePagination.jsx';
import { useFragranceFilter } from '../../../hooks/useFragranceFilter.jsx';
import { useYearRange } from '../../../hooks/useYearRange.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

// Memoized card
const MemoizedFragranceCatCard = memo(FragranceCatCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const BrandPage = () => {
    const navigate = useNavigate();
    const { brand } = useParams();
    const [brandInfo, setBrandInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [composerOpen, setComposerOpen] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        error ? document.title = "Brand Not Found | Scentanyl" : document.title = `${brand} | Scentanyl`;
    }, [brand, error]);

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
        if (brand) {
            fetchBrandData();
        }
    }, [brand]);

    // Reset pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [searchQuery, selectedGender, advancedSearchData, yearRange, yearSort, resetPagination]);

    const fetchBrandData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [brandInfoResponse, fragrancesResponse] = await Promise.all([
                apiFetch(`${API_BASE_URL}/api/brands/${encodeURIComponent(brand)}/info`),
                apiFetch(`${API_BASE_URL}/api/brands/${encodeURIComponent(brand)}`)
            ]);

            if (!brandInfoResponse.ok || !fragrancesResponse.ok) {
                throw new Error('Brand not found');
            }

            const brandData = await brandInfoResponse.json();
            const fragrancesData = await fragrancesResponse.json();

            // Check if the brand data is actually valid
            if (!brandData || !brandData.name || Object.keys(brandData).length === 0) {
                throw new Error('Brand not found');
            }

            setBrandInfo(brandData);
            setFragrances(fragrancesData || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching brand data:', error);
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

    const handleGenderChange = useCallback((gender) => {
        setSelectedGender(gender);
    }, [setSelectedGender]);

    const handleAdvancedSearchChange = useCallback((newAdvancedSearchData) => {
        setAdvancedSearchData(newAdvancedSearchData);
    }, [setAdvancedSearchData]);

    const handleYearRangeChange = useCallback((range) => {
        setYearRange(range);
    }, [setYearRange]);

    const handleYearSortChange = useCallback((sort) => {
        setYearSort(sort);
    }, [setYearSort]);

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return (
            <NotFoundPage headerNum={2} mainMessage={"Brand Not Found"} secondaryMessage={`The brand "${brand}" could not be found or has no fragrances.`} />
        );
    }

    return (
        <PageLayout headerNum={2}>
            <Breadcrumb
                style={{ paddingTop: 30 }}
                items={[
                    { label: 'Brands', to: '/brands' },
                    { label: brandInfo?.name || brand },
                ]}
            />

            <PageHero
                title={`${brandInfo?.name || brand}.`}
                sub={genderCounts.all.toLocaleString()}
                subLines={[
                    'fragrances in the house',
                    ...(brandInfo?.country ? [brandInfo.country] : []),
                    ...(brandInfo?.parent ? [`part of ${brandInfo.parent}`] : []),
                ]}
            />

            {brandInfo?.url && (
                <div className="crumb" style={{ paddingBottom: 18 }}>
                    <a href={brandInfo.url} target="_blank" rel="noopener noreferrer" className="here">
                        ⤴ {brandInfo.name}'s website
                    </a>
                </div>
            )}

            <SearchLine
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
                placeholder="Search fragrances, notes, or accords…"
            />

            <FragranceFilterBar
                selectedGender={selectedGender}
                onGenderChange={handleGenderChange}
                genderCounts={genderCounts}
                minYear={minYear}
                maxYear={maxYear}
                yearRange={yearRange}
                onYearRangeChange={handleYearRangeChange}
                yearSort={yearSort}
                onYearSortChange={handleYearSortChange}
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
                        : searchQuery || selectedGender !== 'all'
                            ? 'try adjusting your search terms or filters'
                            : `no fragrances available for ${brandInfo?.name || brand}`}
                />
            )}

            <section className="frag-more">
                <div className="t">Explore more houses</div>
                <div className="row">
                    <button type="button" className="btn" onClick={() => navigate('/brands')}>
                        ← Back to all brands
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

export default BrandPage;

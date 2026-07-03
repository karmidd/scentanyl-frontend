import React, { useState, useEffect, useCallback, memo } from 'react';
import LoadingPage from '../primary/LoadingPage.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import PageHero from '../../ui/PageHero.jsx';
import SearchLine from '../../ui/SearchLine.jsx';
import Seg from '../../ui/Seg.jsx';
import FilterSelect from '../../ui/FilterSelect.jsx';
import ResultsLine from '../../ui/ResultsLine.jsx';
import CatalogueGrid from '../../ui/CatalogueGrid.jsx';
import IndexCard from '../../ui/IndexCard.jsx';
import LoadMoreRow from '../../ui/LoadMoreRow.jsx';
import EmptyState from '../../ui/EmptyState.jsx';
import { useBrandFilter } from '../../../hooks/useBrandFilter.jsx';
import { usePagination } from '../../../hooks/usePagination.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

const MemoizedIndexCard = memo(IndexCard);

const AllBrandsPage = () => {
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('alphabetical');
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        document.title = `Brands | Scentanyl`;
    }, []);

    // Use custom hooks
    const {
        setBrands,
        filteredBrands,
        searchQuery,
        setSearchQuery,
        selectedCountry,
        setSelectedCountry,
        selectedParent,
        setSelectedParent,
        uniqueCountries,
        uniqueParents,
        clearFilters
    } = useBrandFilter();

    // Sort the filtered brands based on current sort option
    const sortedBrands = React.useMemo(() => {
        const brandsToSort = [...filteredBrands];

        switch (sortBy) {
            case 'alphabetical':
                return brandsToSort.sort((a, b) => a.name.localeCompare(b.name));
            case 'fragranceCount':
                return brandsToSort.sort((a, b) => (b.totalFragrances || 0) - (a.totalFragrances || 0));
            default:
                return brandsToSort;
        }
    }, [filteredBrands, sortBy]);

    const {
        displayedItems: displayedBrands,
        hasMore,
        isLoadingMore,
        loadMore,
        reset: resetPagination
    } = usePagination(sortedBrands, 20);

    // Reset pagination when filters or sorting changes
    useEffect(() => {
        resetPagination();
    }, [searchQuery, selectedCountry, selectedParent, sortBy, resetPagination]);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await apiFetch(`${API_BASE_URL}/api/brands`);
            const data = await response.json();
            setBrands(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    if (loading) {
        return <LoadingPage />;
    }

    const filtersActive = searchQuery || selectedCountry || selectedParent;

    return (
        <PageLayout headerNum={2}>
            <PageHero
                title="The houses."
                sub={sortedBrands.length.toLocaleString()}
                subLines={['houses in the archive']}
            />

            <SearchLine
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
                placeholder="Search for houses…"
            />

            <div className="filter-bar">
                <div className="fb-group">
                    <span className="lbl">Order</span>
                    <Seg
                        value={sortBy}
                        onChange={setSortBy}
                        options={[
                            { value: 'alphabetical', label: 'A → Z' },
                            { value: 'fragranceCount', label: 'Most fragrances' },
                        ]}
                    />
                </div>
                <div className="fb-group">
                    <FilterSelect
                        label="Country"
                        value={selectedCountry}
                        options={uniqueCountries}
                        onChange={setSelectedCountry}
                        allLabel="All countries"
                    />
                    <FilterSelect
                        label="Parent"
                        value={selectedParent}
                        options={uniqueParents}
                        onChange={setSelectedParent}
                        allLabel="All parents"
                    />
                </div>
                {filtersActive && (
                    <button type="button" className="adv-btn" onClick={clearFilters}>✕ Clear filters</button>
                )}
            </div>

            <ResultsLine shown={displayedBrands.length} total={sortedBrands.length} type="houses" />

            {displayedBrands.length > 0 ? (
                <>
                    <CatalogueGrid>
                        {displayedBrands.map((brand, index) => (
                            <MemoizedIndexCard
                                key={brand.id || brand.name || index}
                                index={index}
                                to={`/brands/${encodeURIComponent(brand.name)}`}
                                eyebrow={brand.country || 'House'}
                                name={brand.name}
                                footLeft={brand.totalFragrances != null
                                    ? `${brand.totalFragrances} ${brand.totalFragrances === 1 ? 'fragrance' : 'fragrances'}`
                                    : '—'}
                                footRight={brand.parent || undefined}
                            />
                        ))}
                    </CatalogueGrid>
                    {hasMore ? (
                        <LoadMoreRow
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            label="↓ Load more houses"
                            note={`${displayedBrands.length} of ${sortedBrands.length.toLocaleString()}`}
                        />
                    ) : (
                        <div style={{ paddingBottom: 80 }} />
                    )}
                </>
            ) : (
                <EmptyState big="No houses match." small="try adjusting your search terms or filters" />
            )}
        </PageLayout>
    );
};

export default AllBrandsPage;

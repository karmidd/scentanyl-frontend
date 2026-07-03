import React, { useState, useEffect, useCallback, memo } from 'react';
import LoadingPage from '../primary/LoadingPage.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import PageHero from '../../ui/PageHero.jsx';
import SearchLine from '../../ui/SearchLine.jsx';
import ResultsLine from '../../ui/ResultsLine.jsx';
import CatalogueGrid from '../../ui/CatalogueGrid.jsx';
import FragranceCatCard from '../../ui/FragranceCatCard.jsx';
import LoadMoreRow from '../../ui/LoadMoreRow.jsx';
import EmptyState from '../../ui/EmptyState.jsx';
import Composer from '../../ui/Composer.jsx';
import FragranceFilterBar from './FragranceFilterBar.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

// Memoized card for better performance
const MemoizedFragranceCatCard = memo(FragranceCatCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const AllFragrancesPage = () => {
    const [loading, setLoading] = useState(true);
    const [fragrances, setFragrances] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [composerOpen, setComposerOpen] = useState(false);
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const [yearRange, setYearRange] = useState(null);
    const [yearSort, setYearSort] = useState('none');
    const [advancedSearchData, setAdvancedSearchData] = useState({
        mode: 'regular',
        accords: [],
        excludedAccords: [],
        notes: { top: [], middle: [], base: [], uncategorized: [] },
        excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
    });

    // Stats for filters
    const [stats, setStats] = useState({
        minYear: null,
        maxYear: null,
        genderCounts: { all: 0, men: 0, women: 0, unisex: 0 }
    });

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const PAGE_SIZE = 50;

    useEffect(() => {
        document.title = `Fragrances | Scentanyl`;
    }, []);

    // Debounce search
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch stats once on mount
    useEffect(() => {
        apiFetch(`${API_BASE_URL}/api/fragrances/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching stats:', err));
    }, [API_BASE_URL]);

    // Main fetch function
    const fetchFragrances = useCallback(async (pageNum, append = false) => {

        try {
            const params = new URLSearchParams({
                page: pageNum,
                size: PAGE_SIZE,
                ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
                ...(selectedGender !== 'all' && { gender: selectedGender }),
                ...(yearRange && {
                    minYear: yearRange[0],
                    maxYear: yearRange[1]
                }),
                ...(yearSort !== 'none' && {
                    sortBy: 'year',
                    sortDirection: yearSort === 'newest' ? 'DESC' : 'ASC'
                }),
                // Add advanced search params if needed
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

            const response = await apiFetch(`${API_BASE_URL}/api/fragrances?${params}`);
            const data = await response.json();

            if (append) {
                setFragrances(prev => [...prev, ...data.content]);
            } else {
                setFragrances(data.content);
            }

            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error('Error fetching fragrances:', error);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [API_BASE_URL, debouncedSearchQuery, selectedGender, yearRange, yearSort, advancedSearchData]);

    // Fetch when filters change (reset to page 0)
    useEffect(() => {
        setPage(0);
        fetchFragrances(0, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchQuery, selectedGender, yearRange, yearSort, advancedSearchData.mode, advancedSearchData.accords.length, advancedSearchData.excludedAccords.length,
        JSON.stringify(advancedSearchData.notes),
        JSON.stringify(advancedSearchData.excludedNotes)]);

    // Callbacks for filter changes
    const handleSearch = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleGenderChange = useCallback((gender) => {
        setSelectedGender(gender);
        setPage(0);
    }, []);

    const handleAdvancedSearchChange = useCallback((newAdvancedSearchData) => {
        setAdvancedSearchData(newAdvancedSearchData);
        setPage(0);
    }, []);

    const handleYearRangeChange = useCallback((range) => {
        setYearRange(range);
        setPage(0);
    }, []);

    const handleYearSortChange = useCallback((sort) => {
        setYearSort(sort);
        setPage(0);
    }, []);

    const loadMore = useCallback(() => {
        if (page < totalPages - 1 && !isLoadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFragrances(nextPage, true);
        }
    }, [page, totalPages, isLoadingMore, fetchFragrances]);

    const hasMore = page < totalPages - 1;

    if (loading) {
        return <LoadingPage />;
    }

    const composing = advancedSearchData.mode !== 'regular';

    return (
        <PageLayout headerNum={1}>
            <PageHero
                title="Discover fragrances."
                titleItalic="fragrances."
                sub={totalElements.toLocaleString()}
                subLines={[composing ? 'match your composition' : 'in the archive · indexing']}
            />

            <SearchLine
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
                placeholder="Search fragrances, brands, notes, or accords…"
            />

            <FragranceFilterBar
                selectedGender={selectedGender}
                onGenderChange={handleGenderChange}
                genderCounts={stats.genderCounts || { all: 0, men: 0, women: 0, unisex: 0 }}
                minYear={stats.minYear}
                maxYear={stats.maxYear}
                yearRange={yearRange}
                onYearRangeChange={handleYearRangeChange}
                yearSort={yearSort}
                onYearSortChange={handleYearSortChange}
                advancedSearchData={advancedSearchData}
                onAdvancedSearchChange={handleAdvancedSearchChange}
                onOpenComposer={() => setComposerOpen(true)}
            />

            <ResultsLine
                shown={fragrances.length}
                total={totalElements}
                type="fragrances"
                right={yearSort === 'none' ? 'relevance' : `year · ${yearSort}`}
            />

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

                    {hasMore ? (
                        <LoadMoreRow
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            label="↓ Load more fragrances"
                            note={`${fragrances.length.toLocaleString()} of ${totalElements.toLocaleString()}`}
                        />
                    ) : (
                        <div style={{ paddingBottom: 80 }} />
                    )}
                </>
            ) : (
                <EmptyState
                    big="Nothing matches that composition."
                    small={composing
                        ? 'try removing an excluded note, or widening the search'
                        : yearRange
                            ? 'try adjusting your year range or other filters'
                            : 'try adjusting your search terms or filters'}
                />
            )}

            <Composer
                open={composerOpen}
                onClose={() => setComposerOpen(false)}
                value={advancedSearchData}
                onChange={handleAdvancedSearchChange}
            />
        </PageLayout>
    );
};

export default AllFragrancesPage;

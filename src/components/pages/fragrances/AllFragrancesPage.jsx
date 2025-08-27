import React, { useState, useEffect, useCallback, memo } from 'react';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import FilterSection from "../../utils/FilterSection.jsx";

// Memoized FragranceCard for better performance
const MemoizedFragranceCard = memo(FragranceCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const AllFragrancesPage = () => {
    const [loading, setLoading] = useState(true);
    const [fragrances, setFragrances] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
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
        fetch(`${API_BASE_URL}/api/fragrances/stats`)
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

            const response = await fetch(`${API_BASE_URL}/api/fragrances?${params}`);
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

    return (
        <PageLayout headerNum={1} style={<style jsx>{`
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-fadeIn {
                animation: fadeIn 0.6s ease-out;
            }
        `}</style>}
        >
            {/* Hero Section */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <HeroSection
                    primaryText={"Discover Fragrances"}
                    secondaryText={"Explore thousands of exquisite fragrances from luxury to niche perfumes"}
                />

                {/* Search Bar */}
                <SearchBar
                    size={4}
                    onSubmit={handleSearch}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    message={"Search fragrances, brands, notes, or accords..."}
                    includeRandomButton={true}
                    enableAdvancedSearch={true}
                    onAdvancedSearchChange={handleAdvancedSearchChange}
                />

                {/* Filter Buttons Row */}
                <FilterSection
                    genderFilterData={{
                        onClick: handleGenderChange,
                        selectedGender: selectedGender,
                        counts: stats.genderCounts || { all: 0, men: 0, women: 0, unisex: 0 }
                    }}
                    yearFilterData={{
                        onYearRangeChange: handleYearRangeChange,
                        onSortChange: handleYearSortChange,
                        minYear: stats.minYear,
                        maxYear: stats.maxYear,
                        currentRange: yearRange,
                        currentSort: yearSort
                    }}
                />

                {/* Results Counter */}
                <ResultsCounter
                    displayedCount={fragrances.length}
                    filteredCount={totalElements}
                    type={"fragrances"}
                />
            </div>

            {/* Fragrances Grid */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {fragrances.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                            {fragrances.map((fragrance, index) => (
                                <div
                                    key={fragrance.id}
                                    className="animate-fadeIn"
                                    style={{
                                        animationDelay: `${(index % 20) * 50}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <MemoizedFragranceCard fragrance={fragrance} />
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <LoadMoreButton
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                message={"Load More Fragrances"}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <BlurText
                            text="No fragrances found"
                            delay={100}
                            animateBy="words"
                            direction="bottom"
                            className="flex justify-center text-2xl sm:text-3xl text-gray-300 mb-2 sm:mb-3 md:mb-4"
                        />
                        <p className="text-gray-200 text-base sm:text-lg md:text-xl">
                            {advancedSearchData.mode !== 'regular'
                                ? 'Try adjusting your selected notes, accords, or filters'
                                : yearRange
                                    ? 'Try adjusting your year range or other filters'
                                    : 'Try adjusting your search terms or filters'
                            }
                        </p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default AllFragrancesPage;
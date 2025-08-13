import React, { useState, useEffect, useCallback, memo } from 'react';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import {useFragranceFilter} from "../../../hooks/useFragranceFilter.jsx";
import {usePagination} from "../../../hooks/usePagination.jsx";
import FilterSection from "../../utils/FilterSection.jsx";
import {useYearRange} from "../../../hooks/useYearRange.jsx";

// Memoized FragranceCard for better performance
const MemoizedFragranceCard = memo(FragranceCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const AllFragrancesPage = () => {
    const [loading, setLoading] = useState(true);

    // Use custom hook for all filtering logic (now includes year filtering)
    const {
        setFragrances,
        fragrances,
        filteredFragrances,
        searchQuery,
        setSearchQuery,
        selectedGender,
        setSelectedGender,
        advancedSearchData,
        setAdvancedSearchData,
        yearRange,
        setYearRange,
        yearSort,
        setYearSort
    } = useFragranceFilter();

    // Calculate year range from fragrances
    const [minYear, maxYear] = useYearRange(fragrances);

    // Use custom hook for pagination
    const {
        displayedItems: displayedFragrances,
        hasMore,
        isLoadingMore,
        loadMore,
        reset: resetPagination
    } = usePagination(filteredFragrances, 20);

    // Fetch fragrances on mount
    useEffect(() => {
        const fetchFragrances = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/fragrances');
                const data = await response.json();
                setFragrances(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching fragrances:', error);
                setLoading(false);
            }
        };

        fetchFragrances();
    }, [setFragrances]);

    // Reset pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [searchQuery, selectedGender, advancedSearchData, yearRange, yearSort, resetPagination]);

    // Memoized callbacks
    const handleSearch = useCallback((e) => {
        e.preventDefault();
        // Search is handled automatically by the hook
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

    // New callbacks for year filtering
    const handleYearRangeChange = useCallback((range) => {
        setYearRange(range);
    }, [setYearRange]);

    const handleYearSortChange = useCallback((sort) => {
        setYearSort(sort);
    }, [setYearSort]);

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
                        selectedGender: selectedGender
                    }}
                    yearFilterData={{
                        onYearRangeChange: handleYearRangeChange,
                        onSortChange: handleYearSortChange,
                        minYear: minYear,
                        maxYear: maxYear
                    }}
                />

                {/* Results Counter */}
                <ResultsCounter
                    displayedCount={displayedFragrances.length}
                    filteredCount={filteredFragrances.length}
                    type={"fragrances"}
                />
            </div>

            {/* Fragrances Grid */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {displayedFragrances.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                            {displayedFragrances.map((fragrance, index) => (
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
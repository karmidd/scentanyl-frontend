import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import {useFragranceFilter} from "../../../hooks/useFragranceFilter.jsx";
import {usePagination} from "../../../hooks/usePagination.jsx";
import FilterSection from "../../utils/FilterSection.jsx";
import {useYearRange} from "../../../hooks/useYearRange.jsx";
import NotFoundPage from "../secondary/NotFoundPage.jsx";

// Memoized FragranceCard
const MemoizedFragranceCard = memo(FragranceCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const PerfumerPage = () => {
    const navigate = useNavigate();
    const { perfumer } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();

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

            const response = await fetch(`/api/perfumers/${encodeURIComponent(perfumer)}`);

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
        return <LoadingPage/>;
    }

    if (error) {
        return (
            <NotFoundPage headerNum={5} mainMessage={"Perfumer Not Found"} secondaryMessage={`The perfumer "${perfumer}" could not be found or has no fragrances.`} />
        );
    }

    return (
        <PageLayout headerNum={5} style={<style jsx>{`
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
            {/* Perfumer Info Section */}
            <div className="space-y-6 sm:space-y-8 md:space-y-10 mb-8 sm:mb-12 md:mb-16">
                <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
                    <BlurText
                        text={perfumer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        delay={100}
                        animateBy="words"
                        direction="top"
                        className="text-shadow-lg flex justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight px-2"
                    />

                    <BlurText
                        text={`${genderCounts.all} ${genderCounts.all === 1 ? 'Fragrance' : 'Fragrances'} Created`}
                        delay={150}
                        animateBy="words"
                        direction="bottom"
                        className="text-shadow-md flex justify-center text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200"
                    />

                    {/* Gender Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                        <div className={`${theme.card.primary} shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                            <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{genderCounts.all}</div>
                            <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Total Fragrances</div>
                        </div>
                        <div className={`${theme.card.primary} rounded-lg shadow-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                            <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-green-500">{genderCounts.men}</div>
                            <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Men's</div>
                        </div>
                        <div className={`${theme.card.primary} rounded-lg shadow-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                            <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-pink-500">{genderCounts.women}</div>
                            <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Women's</div>
                        </div>
                        <div className={`${theme.card.primary} rounded-lg shadow-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                            <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-purple-500">{genderCounts.unisex}</div>
                            <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Unisex</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center">
                    <BlurText
                        text={`Explore all fragrances created by ${perfumer}`}
                        delay={150}
                        animateBy="words"
                        direction="bottom"
                        className="flex justify-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2"
                    />
                </div>

                <SearchBar
                    size={4}
                    onSubmit={handleSearch}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    message={"Search fragrances, brands, notes, or accords..."}
                    enableAdvancedSearch={true}
                    onAdvancedSearchChange={handleAdvancedSearchChange}
                />

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

                <ResultsCounter displayedCount={displayedFragrances.length} filteredCount={filteredFragrances.length} type={"fragrances"}/>
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

                        {hasMore && (
                            <LoadMoreButton onClick={loadMore} disabled={isLoadingMore} message={"Load More Fragrances"}/>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <BlurText
                            text="No fragrances found"
                            delay={100}
                            animateBy="words"
                            direction="bottom"
                            className="flex justify-center text-2xl sm:text-3xl text-gray-200 mb-2 sm:mb-3 md:mb-4"
                        />
                        <p className="text-gray-500 text-base sm:text-lg md:text-xl">
                            {advancedSearchData.mode !== 'regular'
                                ? 'Try adjusting your selected notes, accords, or filters'
                                : searchQuery || selectedGender !== 'all'
                                    ? 'Try adjusting your search terms or filters'
                                    : `No fragrances available for ${perfumer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`
                            }
                        </p>
                    </div>
                )}

                {/* Back to Perfumers Button */}
                <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 pt-8 sm:pt-12 md:pt-16">
                    <BlurText
                        text="Explore More Perfumers"
                        delay={300}
                        animateBy="words"
                        direction="bottom"
                        className="text-shadow-lg flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                        <button
                            onClick={() => navigate('/perfumers')}
                            className={`text-shadow-md shadow-lg cursor-pointer ${theme.button.primary} ${theme.shadow.button} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl`}
                        >
                            Back to All Perfumers
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default PerfumerPage;
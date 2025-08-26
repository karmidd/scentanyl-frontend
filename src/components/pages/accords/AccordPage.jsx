import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import {useFragranceFilter} from "../../../hooks/useFragranceFilter.jsx";
import {usePagination} from "../../../hooks/usePagination.jsx";
import {useYearRange} from "../../../hooks/useYearRange.jsx";
import FilterSection from "../../utils/FilterSection.jsx";
import NotFoundPage from "../secondary/NotFoundPage.jsx";

// Memoized FragranceCard
const MemoizedFragranceCard = memo(FragranceCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const AccordPage = () => {
    const { accord } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();
    const API_BASE_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        error ? document.title = "Accord Not Found | Scentanyl" : document.title = `${accord.split(/(\s|\(|\))/).map(w => /^[a-zA-Z]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w).join('')} Accord | Scentanyl`;
    }, [accord, error]);

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
        if (accord) {
            fetchAccordFragrances();
        }
    }, [accord]);

    // Reset pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [searchQuery, selectedGender, advancedSearchData, yearRange, yearSort, resetPagination]);

    const fetchAccordFragrances = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/accords/${encodeURIComponent(accord)}`);
            if (!response.ok) {
                throw new Error(`Accord "${accord}" not found`);
            }
            const data = await response.json();
            if (!data || (Array.isArray(data) && data.length === 0)) {
                throw new Error(`No fragrances found for accord "${accord}"`);
            }
            setFragrances(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accord fragrances:', error);
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
            <NotFoundPage headerNum={4} mainMessage={"Accord Not Found"} secondaryMessage={`The accord "${accord}" could not be found or has no fragrances.`} />
        );
    }

    return (
        <PageLayout headerNum={4} style={<style jsx>{`
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
                <HeroSection secondaryText={"Discover all fragrances featuring this distinctive accord"} primaryText={`${accord} Accord`}/>

                {/* Accord Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                    <div className={`${theme.card.primary} shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{genderCounts.all}</div>
                        <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Total Fragrances</div>
                    </div>
                    <div className={`${theme.card.primary} shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-green-500">{genderCounts.men}</div>
                        <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Men's</div>
                    </div>
                    <div className={`${theme.card.primary} shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-pink-500">{genderCounts.women}</div>
                        <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Women's</div>
                    </div>
                    <div className={`${theme.card.primary} shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-purple-500">{genderCounts.unisex}</div>
                        <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Unisex</div>
                    </div>
                </div>

                <SearchBar
                    size={4}
                    onChange={handleSearchChange}
                    value={searchQuery}
                    onSubmit={handleSearch}
                    message={"Search fragrances, brands, or notes..."}
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

                <ResultsCounter displayedCount={displayedFragrances.length} filteredCount={filteredFragrances.length} type={"fragrances"} />
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
                            <LoadMoreButton disabled={isLoadingMore} onClick={loadMore} message={"Load more fragrances"}/>
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
                                ? <BlurText
                                    text="Try adjusting your selected notes, accords, or filters"
                                    delay={100}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center mb-2 sm:mb-3 md:mb-4"
                                />
                                : <BlurText
                                    text="Try adjusting your search terms or filters"
                                    delay={50}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center mb-2 sm:mb-3 md:mb-4"
                                />
                            }
                        </p>
                    </div>
                )}

                {/* Back to Accords Button */}
                <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 pt-8 sm:pt-12 md:pt-16">
                    <BlurText
                        text="Explore More Accords"
                        delay={300}
                        animateBy="words"
                        direction="bottom"
                        className="text-shadow-lg flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                        <button
                            onClick={() => navigate('/accords')}
                            className={`text-shadow-md shadow-lg cursor-pointer ${theme.button.primary} ${theme.shadow.button} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl`}
                        >
                            Back to All Accords
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default AccordPage;
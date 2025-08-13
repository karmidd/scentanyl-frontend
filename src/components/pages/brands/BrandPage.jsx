import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import {usePagination} from "../../../hooks/usePagination.jsx";
import {useFragranceFilter} from "../../../hooks/useFragranceFilter.jsx";
import FilterSection from "../../utils/FilterSection.jsx";
import {useYearRange} from "../../../hooks/useYearRange.jsx";

// Memoized FragranceCard
const MemoizedFragranceCard = memo(FragranceCard, (prevProps, nextProps) => {
    return prevProps.fragrance.id === nextProps.fragrance.id;
});

const BrandPage = () => {
    const navigate = useNavigate();
    const { brand } = useParams();
    const [brandInfo, setBrandInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();

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
                fetch(`/api/brands/${encodeURIComponent(brand)}/info`),
                fetch(`/api/brands/${encodeURIComponent(brand)}`)
            ]);

            if (!brandInfoResponse.ok || !fragrancesResponse.ok) {
                throw new Error('Brand not found');
            }

            const brandData = await brandInfoResponse.json();
            const fragrancesData = await fragrancesResponse.json();

            setBrandInfo(brandData);
            setFragrances(fragrancesData);
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
        return <LoadingPage/>;
    }

    if (error) {
        return (
            <div className="relative min-h-screen overflow-hidden">
                <Background />
                <div className="relative z-10 font-['Viaoda_Libre',serif] text-base sm:text-lg md:text-xl lg:text-2xl">
                    <div className="text-white">
                        <Header page={2} />
                        <main className="mt-5 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pt-[80px] sm:pt-[100px] md:pt-[160px]">
                            <div className="text-center py-8 sm:py-12 md:py-16">
                                <BlurText
                                    text="Brand Not Found"
                                    delay={100}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-3xl sm:text-4xl font-bold text-red-600 mb-2 sm:mb-3 md:mb-4"
                                />
                                <p className="text-gray-200 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8">
                                    The brand "{brand}" could not be found.
                                </p>
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className={`${theme.button.hover} ${theme.button.primary} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl`}
                                >
                                    Browse All Fragrances
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PageLayout headerNum={2} style={<style jsx>{`
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
            {/* Brand Info Section */}
            {brandInfo && (
                <div className="space-y-6 sm:space-y-8 md:space-y-10 mb-4 sm:mb-6 md:mb-8">
                    <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
                        <BlurText
                            text={brandInfo.name}
                            delay={100}
                            animateBy="words"
                            direction="top"
                            className="text-shadow-lg flex justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight px-2"
                        />
                        <div className="space-y-2 sm:space-y-3">
                            {brandInfo.country && (
                                <div className="inline-flex items-center">
                                    <BlurText
                                        text={`From `}
                                        delay={150}
                                        animateBy="words"
                                        direction="bottom"
                                        className={`text-shadow-md text-xl sm:text-2xl md:text-3xl text-gray-200`}
                                    />
                                    <BlurText
                                        text={`${brandInfo.country}`}
                                        delay={150}
                                        animateBy="words"
                                        direction="bottom"
                                        className={`text-shadow-md text-xl sm:text-2xl md:text-3xl font-semibold ${theme.text.accent}`}
                                    />
                                </div>
                            )}
                            {brandInfo.parent && (
                                <div className="items-center">
                                    <BlurText
                                        text={`Part of ${brandInfo.parent}`}
                                        delay={200}
                                        animateBy="words"
                                        direction="bottom"
                                        className={`flex justify-center text-sm sm:text-base md:text-lg text-gray-300 italic`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <HeroSection secondaryText={`Discover all fragrances from ${brandInfo?.name || brand}`}/>

                <SearchBar
                    size={4}
                    onSubmit={handleSearch}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    message={"Search fragrances, notes, or accords..."}
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

                        {/* Load More Button */}
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
                            className="flex justify-center text-2xl sm:text-3xl text-gray-400 mb-2 sm:mb-3 md:mb-4"
                        />
                        <p className="text-gray-500 text-base sm:text-lg md:text-xl">
                            {advancedSearchData.mode !== 'regular'
                                ? 'Try adjusting your selected notes, accords, or filters'
                                : searchQuery || selectedGender !== 'all'
                                    ? 'Try adjusting your search terms or filters'
                                    : `No fragrances available for ${brandInfo?.name || brand}`
                            }
                        </p>
                    </div>
                )}
                {/* Back to Brands Button */}
                <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 pt-8 sm:pt-12 md:pt-16">
                    <BlurText
                        text="Explore More Brands"
                        delay={300}
                        animateBy="words"
                        direction="bottom"
                        className="flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                        <button
                            onClick={() => navigate('/brands')}
                            className={`cursor-pointer ${theme.button.primary} ${theme.shadow.button} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl`}
                        >
                            Back to All Brands
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default BrandPage;
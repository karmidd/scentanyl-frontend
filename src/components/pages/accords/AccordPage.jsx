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
import FilterSection from "../../utils/FilterSection.jsx";
import NotFoundPage from "../secondary/errors/NotFoundPage.jsx";
import {apiFetch} from "../../utils/apiFetch.jsx";

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
    const [fragrances, setFragrances] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const PAGE_SIZE = 50;
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
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        error ? document.title = "Accord Not Found | Scentanyl" : document.title = `${accord.split(/(\s|\(|\))/).map(w => /^[a-zA-Z]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w).join('')} Accord | Scentanyl`;
    }, [accord, error]);

    // Calculate year range from fragrances
    const [stats, setStats] = useState({
        minYear: null,
        maxYear: null,
        genderCounts: { all: 0, men: 0, women: 0, unisex: 0 }
    });

    const loadMore = useCallback(() => {
        if (page < totalPages - 1 && !isLoadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFragrances(nextPage, true);
        }
    }, [page, totalPages, isLoadingMore]);

    const hasMore = page < totalPages - 1;

    useEffect(() => {
        setPage(0);
        fetchFragrances(0, false);
    }, [debouncedSearchQuery, selectedGender, yearRange, yearSort, advancedSearchData.mode, advancedSearchData.accords.length, advancedSearchData.excludedAccords.length, JSON.stringify(advancedSearchData.notes), JSON.stringify(advancedSearchData.excludedNotes)]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/accords/${encodeURIComponent(accord)}/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching stats:', err));
    }, [API_BASE_URL, accord]);

    const fetchFragrances = useCallback(async (pageNum, append = false) => {
        try {
            const params = new URLSearchParams({
                page: pageNum,
                size: PAGE_SIZE,
                ...(searchQuery && { search: searchQuery }),
                ...(selectedGender !== 'all' && { gender: selectedGender }),
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

            const response = await apiFetch(`${API_BASE_URL}/api/accords/${encodeURIComponent(accord)}?${params}`);

            if (!response.ok) {
                throw new Error(`Accord "${accord}" not found`);
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
            console.error('Error fetching accord fragrances:', error);
            setError(error.message);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [API_BASE_URL, accord, debouncedSearchQuery, selectedGender, yearRange, yearSort, advancedSearchData]);

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
                        <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{stats.genderCounts.all}</div>
                        <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Total Fragrances</div>
                    </div>
                    <div className={`${theme.card.primary} shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-green-500">{stats.genderCounts.men}</div>
                        <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Men's</div>
                    </div>
                    <div className={`${theme.card.primary} shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-pink-500">{stats.genderCounts.women}</div>
                        <div className={`text-shadow-xs text-xs sm:text-sm ${theme.text.secondary}`}>Women's</div>
                    </div>
                    <div className={`${theme.card.primary} shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-shadow-xs text-xl sm:text-2xl md:text-3xl font-bold text-purple-500">{stats.genderCounts.unisex}</div>
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
                        minYear: stats.minYear,
                        maxYear: stats.maxYear
                    }}
                />

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
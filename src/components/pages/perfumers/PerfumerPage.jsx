import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import GenderFilterButtons from "../../utils/buttons/GenderFilterButtons.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import PageLayout from "../../primary/PageLayout.jsx";

const PerfumerPage = () => {
    const navigate = useNavigate();
    const { perfumer } = useParams();
    const [fragrances, setFragrances] = useState([]);
    const [displayedFragrances, setDisplayedFragrances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedGender, setSelectedGender] = useState('all');
    const [advancedSearchData, setAdvancedSearchData] = useState({
        mode: 'regular',
        accords: [],
        notes: { top: [], middle: [], base: [], uncategorized: [] }
    });
    const [error, setError] = useState(null);
    const [genderCounts, setGenderCounts] = useState({
        total: fragrances.length,
        men: 0,
        women: 0,
        unisex: 0
    });
    const { theme } = useTheme();

    const FRAGRANCES_PER_PAGE = 20;

    useEffect(() => {
        if (perfumer) {
            fetchPerfumerData();
        }
    }, [perfumer]);

    useEffect(() => {
        filterFragrances();
    }, [searchQuery, selectedGender, fragrances, advancedSearchData.mode, JSON.stringify(advancedSearchData.accords), JSON.stringify(advancedSearchData.notes)]);

    const fetchPerfumerData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/perfumers/${encodeURIComponent(perfumer)}`);

            if (!response.ok) {
                throw new Error('Perfumer not found');
            }

            const fragrancesData = await response.json();

            const counts = {
                total: fragrancesData.length,
                men: fragrancesData.filter(f => f.gender?.toLowerCase() === 'men').length,
                women: fragrancesData.filter(f => f.gender?.toLowerCase() === 'women').length,
                unisex: fragrancesData.filter(f => f.gender?.toLowerCase() === 'unisex').length
            };

            setFragrances(fragrancesData);
            setGenderCounts(counts);
            setDisplayedFragrances(fragrancesData.slice(0, FRAGRANCES_PER_PAGE));
            setHasMore(fragrancesData.length > FRAGRANCES_PER_PAGE);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching perfumer data:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const matchesAdvancedSearch = (fragrance) => {
        if (advancedSearchData.mode === 'regular') {
            return true;
        }

        // Check accords
        if (advancedSearchData.accords.length > 0) {
            const fragranceAccords = fragrance.accords?.toLowerCase().split(',').map(a => a.trim()) || [];
            const hasAllAccords = advancedSearchData.accords.every(accord =>
                fragranceAccords.some(fa => fa.includes(accord.toLowerCase()))
            );
            if (!hasAllAccords) return false;
        }

        // Check notes based on mode
        if (advancedSearchData.mode === 'layered') {
            // Check top notes
            if (advancedSearchData.notes.top.length > 0) {
                const fragranceTopNotes = fragrance.topNotes?.toLowerCase().split(',').map(n => n.trim()) || [];
                const hasAllTopNotes = advancedSearchData.notes.top.every(note =>
                    fragranceTopNotes.some(fn => fn.includes(note.toLowerCase()))
                );
                if (!hasAllTopNotes) return false;
            }

            // Check middle notes
            if (advancedSearchData.notes.middle.length > 0) {
                const fragranceMiddleNotes = fragrance.middleNotes?.toLowerCase().split(',').map(n => n.trim()) || [];
                const hasAllMiddleNotes = advancedSearchData.notes.middle.every(note =>
                    fragranceMiddleNotes.some(fn => fn.includes(note.toLowerCase()))
                );
                if (!hasAllMiddleNotes) return false;
            }

            // Check base notes
            if (advancedSearchData.notes.base.length > 0) {
                const fragranceBaseNotes = fragrance.baseNotes?.toLowerCase().split(',').map(n => n.trim()) || [];
                const hasAllBaseNotes = advancedSearchData.notes.base.every(note =>
                    fragranceBaseNotes.some(fn => fn.includes(note.toLowerCase()))
                );
                if (!hasAllBaseNotes) return false;
            }
        } else if (advancedSearchData.mode === 'uncategorized') {
            // Check uncategorized notes
            if (advancedSearchData.notes.uncategorized.length > 0) {
                const fragranceUncategorizedNotes = fragrance.uncategorizedNotes?.toLowerCase().split(',').map(n => n.trim()) || [];
                const hasAllUncategorizedNotes = advancedSearchData.notes.uncategorized.every(note =>
                    fragranceUncategorizedNotes.some(fn => fn.includes(note.toLowerCase()))
                );
                if (!hasAllUncategorizedNotes) return false;
            }
        }

        return true;
    };

    const filterFragrances = () => {
        let filtered = fragrances;

        // Apply advanced search filter first
        if (advancedSearchData.mode !== 'regular') {
            filtered = filtered.filter(matchesAdvancedSearch);
        } else if (searchQuery.trim()) {
            // Apply regular search filter
            filtered = filtered.filter(fragrance =>
                fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.topNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.middleNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.baseNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.uncategorizedNotes?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedGender !== 'all') {
            filtered = filtered.filter(fragrance =>
                fragrance.gender?.toLowerCase() === selectedGender.toLowerCase()
            );
        }

        setDisplayedFragrances(filtered.slice(0, FRAGRANCES_PER_PAGE * currentPage));
        setHasMore(filtered.length > FRAGRANCES_PER_PAGE * currentPage);
    };

    const loadMoreFragrances = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        setTimeout(() => {
            let filtered = fragrances;

            // Apply the same filtering logic
            if (advancedSearchData.mode !== 'regular') {
                filtered = filtered.filter(matchesAdvancedSearch);
            } else if (searchQuery.trim()) {
                filtered = filtered.filter(fragrance =>
                    fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    fragrance.topNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    fragrance.middleNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    fragrance.baseNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    fragrance.uncategorizedNotes?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (selectedGender !== 'all') {
                filtered = filtered.filter(fragrance =>
                    fragrance.gender?.toLowerCase() === selectedGender.toLowerCase()
                );
            }

            const newFragrances = filtered.slice(0, FRAGRANCES_PER_PAGE * nextPage);
            setDisplayedFragrances(newFragrances);
            setCurrentPage(nextPage);
            setHasMore(filtered.length > FRAGRANCES_PER_PAGE * nextPage);
            setLoadingMore(false);
        }, 800);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        filterFragrances();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
        setCurrentPage(1);
    };

    const handleAdvancedSearchChange = useCallback((newAdvancedSearchData) => {
        setAdvancedSearchData(newAdvancedSearchData);
        setCurrentPage(1);
    }, []);

    const getFilteredCount = () => {
        let filtered = fragrances;

        if (advancedSearchData.mode !== 'regular') {
            filtered = filtered.filter(matchesAdvancedSearch);
        } else if (searchQuery.trim()) {
            filtered = filtered.filter(fragrance =>
                fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.topNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.middleNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.baseNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.uncategorizedNotes?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedGender !== 'all') {
            filtered = filtered.filter(fragrance =>
                fragrance.gender?.toLowerCase() === selectedGender.toLowerCase()
            );
        }

        return filtered.length;
    };

    const getSearchModeText = () => {
        if (advancedSearchData.mode === 'regular') {
            return 'Standard search mode';
        } else if (advancedSearchData.mode === 'layered') {
            return 'Advanced layered search mode';
        } else {
            return 'Advanced uncategorized search mode';
        }
    };

    if (loading) {
        return (
            <LoadingPage/>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen overflow-hidden">
                <Background />
                <div className="relative z-10 font-['Viaoda_Libre',serif] text-base sm:text-lg md:text-xl lg:text-2xl">
                    <div className="text-white">
                        <Header page={5} />
                        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pt-[80px] sm:pt-[100px] md:pt-[160px]">
                            <div className="text-center py-8 sm:py-12 md:py-16">
                                <BlurText
                                    text="Perfumer Not Found"
                                    delay={100}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-3xl sm:text-4xl text-red-400 mb-2 sm:mb-3 md:mb-4"
                                />
                                <p className="text-gray-500 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8">
                                    The perfumer "{perfumer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}" could not be found.
                                </p>
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl"
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
                        className="flex justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight px-2"
                    />

                    <BlurText
                        text={`${genderCounts.total} ${genderCounts.total === 1 ? 'Fragrance' : 'Fragrances'} Created`}
                        delay={150}
                        animateBy="words"
                        direction="bottom"
                        className="flex justify-center text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200"
                    />

                    {/* Gender Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                        <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{genderCounts.total}</div>
                            <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>Total Fragrances</div>
                        </div>
                        <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500">{genderCounts.men}</div>
                            <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>Men's</div>
                        </div>
                        <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-500">{genderCounts.women}</div>
                            <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>Women's</div>
                        </div>
                        <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-500">{genderCounts.unisex}</div>
                            <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>Unisex</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center">
                    <BlurText
                        text={`Explore all fragrances created by ${perfumer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`}
                        delay={350}
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

                {/* Search Mode Indicator */}
                {advancedSearchData.mode !== 'regular' && (
                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            {getSearchModeText()}
                        </p>
                    </div>
                )}

                <GenderFilterButtons onClick={handleGenderChange} selectedGender={selectedGender}/>

                <ResultsCounter displayedCount={displayedFragrances.length} filteredCount={getFilteredCount()} type={"fragrances"}/>
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
                                        animationDelay: `${(index % FRAGRANCES_PER_PAGE) * 50}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <FragranceCard fragrance={fragrance} />
                                </div>
                            ))}
                        </div>

                        {hasMore && (
                            <LoadMoreButton onClick={loadMoreFragrances} disabled={loadingMore} message={"Load More Fragrances"}/>
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
                        className="flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                        <button
                            onClick={() => navigate('/perfumers')}
                            className={`cursor-pointer ${theme.button.primary} ${theme.shadow.button} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl`}
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
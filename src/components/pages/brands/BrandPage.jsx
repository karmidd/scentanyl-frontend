import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import GenderFilterButtons from "../../utils/buttons/GenderFilterButtons.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import PageLayout from "../../primary/PageLayout.jsx";

const BrandPage = () => {
    const navigate = useNavigate();
    const { brand } = useParams();
    const [brandInfo, setBrandInfo] = useState(null);
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
    const { theme } = useTheme();

    const FRAGRANCES_PER_PAGE = 20;

    useEffect(() => {
        if (brand) {
            fetchBrandData();
        }
    }, [brand]);

    useEffect(() => {
        filterFragrances();
    }, [searchQuery, selectedGender, fragrances, advancedSearchData.mode, JSON.stringify(advancedSearchData.accords), JSON.stringify(advancedSearchData.notes)]);

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
            setDisplayedFragrances(fragrancesData.slice(0, FRAGRANCES_PER_PAGE));
            setHasMore(fragrancesData.length > FRAGRANCES_PER_PAGE);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching brand data:', error);
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
                fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                    fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                            className="flex justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight px-2"
                        />
                        <div className="space-y-2 sm:space-y-3">
                            {brandInfo.country && (
                                <div className="inline-flex items-center">
                                    <BlurText
                                        text={`From `}
                                        delay={150}
                                        animateBy="words"
                                        direction="bottom"
                                        className={`text-xl sm:text-2xl md:text-3xl text-gray-200`}
                                    />
                                    <BlurText
                                        text={`${brandInfo.country}`}
                                        delay={150}
                                        animateBy="words"
                                        direction="bottom"
                                        className={`text-xl sm:text-2xl md:text-3xl font-semibold ${theme.text.accent}`}
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

                {/* Search Mode Indicator */}
                {advancedSearchData.mode !== 'regular' && (
                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            {getSearchModeText()}
                        </p>
                    </div>
                )}

                <GenderFilterButtons onClick={handleGenderChange} selectedGender={selectedGender} />

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

                        {/* Load More Button */}
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
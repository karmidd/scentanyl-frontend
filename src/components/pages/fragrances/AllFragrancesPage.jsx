import React, { useState, useEffect, useCallback } from 'react';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import GenderFilterButtons from "../../utils/buttons/GenderFilterButtons.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";

const AllFragrancesPage = () => {
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

    const FRAGRANCES_PER_PAGE = 20;

    useEffect(() => {
        fetchFragrances();
    }, []);

    useEffect(() => {
        filterFragrances();
    }, [searchQuery, selectedGender, fragrances, advancedSearchData.mode, JSON.stringify(advancedSearchData.accords), JSON.stringify(advancedSearchData.notes)]);

    const fetchFragrances = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/fragrances');
            const data = await response.json();
            setFragrances(data);
            setDisplayedFragrances(data.slice(0, FRAGRANCES_PER_PAGE));
            setHasMore(data.length > FRAGRANCES_PER_PAGE);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching fragrances:', error);
            setLoading(false);
        }
    };

    const matchesAdvancedSearch = (fragrance) => {
        if (advancedSearchData.mode === 'regular') {
            return true; // Regular search handled separately
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

        // Filter by gender
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

            // Apply the same filtering logic as in filterFragrances
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
            <LoadingPage />
        );
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
                <HeroSection primaryText={"Discover Fragrances"} secondaryText={"Explore thousands of exquisite fragrances from luxury to niche perfumes"}/>

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
                    advancedSearchData={advancedSearchData}
                />

                {/* Search Mode Indicator */}
                {advancedSearchData.mode !== 'regular' && (
                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            {getSearchModeText()}
                        </p>
                    </div>
                )}

                {/* Gender Filter */}
                <GenderFilterButtons onClick={handleGenderChange} selectedGender={selectedGender} />

                {/* Results Counter */}
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
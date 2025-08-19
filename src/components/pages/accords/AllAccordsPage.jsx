import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import GeneralCard from "../../cards/GeneralCard.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import SortButtons from "../../utils/buttons/SortButtons.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import {useItemFilter} from "../../../hooks/useItemFilter.jsx";
import {usePagination} from "../../../hooks/usePagination.jsx";

// Memoized GeneralCard
const MemoizedGeneralCard = memo(GeneralCard, (prevProps, nextProps) => {
    return prevProps.name === nextProps.name && prevProps.total === nextProps.total;
});

const AllAccordsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = `Accords | Scentanyl`;
    }, []);

    // Use custom hooks
    const {
        setItems: setAccords,
        filteredItems: filteredAccords,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy
    } = useItemFilter(['alphabetical', 'fragranceCount']);

    const {
        displayedItems: displayedAccords,
        hasMore,
        isLoadingMore,
        loadMore,
        reset: resetPagination
    } = usePagination(filteredAccords, 20);

    useEffect(() => {
        fetchAccords();
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [searchQuery, sortBy, resetPagination]);

    const fetchAccords = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/accords');
            const accordsArray = await response.json();
            setAccords(accordsArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accords:', error);
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

    const handleSortChange = useCallback((newSortBy) => {
        setSortBy(newSortBy);
    }, [setSortBy]);

    const handleAccordClick = useCallback((accord) => {
        navigate(`/accords/${encodeURIComponent(accord.name)}`);
    }, [navigate]);

    if (loading) {
        return <LoadingPage/>;
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
                <HeroSection primaryText={"Explore Accords"} secondaryText={"Discover the harmonic structures that define fragrance families"}/>

                <SearchBar
                    size={2}
                    onSubmit={handleSearch}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    message={"Search for accords..."}
                />

                <SortButtons handleSortChange={handleSortChange} sortBy={sortBy} />

                <ResultsCounter
                    displayedCount={displayedAccords.length}
                    filteredCount={filteredAccords.length}
                    type={"accords"}
                />
            </div>

            {/* Accords Grid */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {displayedAccords.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                            {displayedAccords.map((accord, index) => (
                                <div
                                    key={accord.id}
                                    className="animate-fadeIn"
                                    style={{
                                        animationDelay: `${(index % 20) * 50}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <MemoizedGeneralCard
                                        name={accord.name}
                                        total={accord.totalFragrances}
                                        message={"Click to explore fragrances with this accord"}
                                        onClick={() => handleAccordClick(accord)}
                                        href={`/accords/${encodeURIComponent(accord.name)}`}  // Add this line
                                    />
                                </div>
                            ))}
                        </div>

                        {hasMore && (
                            <LoadMoreButton onClick={loadMore} disabled={isLoadingMore} message={"Load More Accords"} />
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <BlurText
                            text="No accords found"
                            delay={100}
                            animateBy="words"
                            direction="bottom"
                            className="flex justify-center text-2xl sm:text-3xl text-gray-400 mb-2 sm:mb-3 md:mb-4"
                        />
                        <p className="text-gray-500 text-base sm:text-lg md:text-xl">
                            Try adjusting your search terms
                        </p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default AllAccordsPage;
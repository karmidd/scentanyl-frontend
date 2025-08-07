import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import GeneralCard from "../../cards/GeneralCard.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import SortButtons from "../../utils/buttons/SortButtons.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import {useItemFilter} from "../../../hooks/useItemFilter.jsx";
import {usePagination} from "../../../hooks/usePagination.jsx";

// Memoized GeneralCard
const MemoizedGeneralCard = memo(GeneralCard, (prevProps, nextProps) => {
    return prevProps.name === nextProps.name && prevProps.total === nextProps.total;
});

const AllPerfumersPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Use custom hooks
    const {
        setItems: setPerfumers,
        filteredItems: filteredPerfumers,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy
    } = useItemFilter(['alphabetical', 'fragranceCount']);

    const {
        displayedItems: displayedPerfumers,
        hasMore,
        isLoadingMore,
        loadMore,
        reset: resetPagination
    } = usePagination(filteredPerfumers, 20);

    useEffect(() => {
        fetchPerfumers();
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [searchQuery, sortBy, resetPagination]);

    const fetchPerfumers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/perfumers');
            const perfumersArray = await response.json();
            setPerfumers(perfumersArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching perfumers:', error);
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

    const handlePerfumerClick = useCallback((perfumer) => {
        navigate(`/perfumers/${encodeURIComponent(perfumer.name)}`);
    }, [navigate]);

    if (loading) {
        return <LoadingPage/>;
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
            {/* Hero Section */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <HeroSection primaryText={"Explore Perfumers"} secondaryText={"Discover the noses behind your favorite fragrances"}/>

                <SearchBar
                    size={2}
                    message={"Search for perfumers..."}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onSubmit={handleSearch}
                />

                <SortButtons handleSortChange={handleSortChange} sortBy={sortBy}/>

                <ResultsCounter
                    type={"perfumers"}
                    filteredCount={filteredPerfumers.length}
                    displayedCount={displayedPerfumers.length}
                />
            </div>

            {/* Perfumers Grid */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {displayedPerfumers.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                            {displayedPerfumers.map((perfumer, index) => (
                                <div
                                    key={perfumer.id || perfumer.name}
                                    className="animate-fadeIn"
                                    style={{
                                        animationDelay: `${(index % 20) * 50}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <MemoizedGeneralCard
                                        name={perfumer.name}
                                        total={perfumer.totalContributions}
                                        onClick={() => handlePerfumerClick(perfumer)}
                                        message={"Click to explore fragrances made by this perfumer"}
                                    />
                                </div>
                            ))}
                        </div>

                        {hasMore && (
                            <LoadMoreButton onClick={loadMore} disabled={isLoadingMore} message={"Load More Perfumers"}/>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <BlurText
                            text="No perfumers found"
                            delay={100}
                            animateBy="words"
                            direction="bottom"
                            className="flex justify-center text-2xl sm:text-3xl text-gray-400 mb-2 sm:mb-3 md:mb-4"
                        />
                        <p className="text-gray-300 text-base sm:text-lg md:text-xl">
                            Try adjusting your search terms
                        </p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default AllPerfumersPage;
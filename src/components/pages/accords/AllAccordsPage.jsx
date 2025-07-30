import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import LoadingPage from "../LoadingPage.jsx";
import GeneralCard from "../../cards/GeneralCard.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import SortButtons from "../../utils/buttons/SortButtons.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import Footer from "../../primary/Footer.jsx";

const AllAccordsPage = () => {
    const navigate = useNavigate();
    const [accords, setAccords] = useState([]);
    const [displayedAccords, setDisplayedAccords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState('alphabetical');
    const { theme } = useTheme();

    const ACCORDS_PER_PAGE = 20;

    useEffect(() => {
        fetchAccords();
    }, []);

    useEffect(() => {
        if (!loading) {
            filterAndSortAccords();
        }
    }, [searchQuery, sortBy, accords]);

    const fetchAccords = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/accords');
            const accordsArray = await response.json();
            setAccords(accordsArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accords:', error);
            setLoading(false);
        }
    };

    const filterAndSortAccords = () => {
        let filtered = accords;

        if (searchQuery.trim()) {
            filtered = filtered.filter(accord =>
                accord.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === 'alphabetical') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'popularity') {
            filtered.sort((a, b) => b.totalAppearances - a.totalAppearances);
        }

        setDisplayedAccords(filtered.slice(0, ACCORDS_PER_PAGE * currentPage));
        setHasMore(filtered.length > ACCORDS_PER_PAGE * currentPage);
    };

    const loadMoreAccords = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        setTimeout(() => {
            let filtered = accords;

            if (searchQuery.trim()) {
                filtered = filtered.filter(accord =>
                    accord.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (sortBy === 'alphabetical') {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === 'popularity') {
                filtered.sort((a, b) => b.totalAppearances - a.totalAppearances);
            }

            const newAccords = filtered.slice(0, ACCORDS_PER_PAGE * nextPage);
            setDisplayedAccords(newAccords);
            setCurrentPage(nextPage);
            setHasMore(filtered.length > ACCORDS_PER_PAGE * nextPage);
            setLoadingMore(false);
        }, 800);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        filterAndSortAccords();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        setCurrentPage(1);
    };

    const handleAccordClick = (accord) => {
        navigate(`/accords/${encodeURIComponent(accord.name)}`);
    };

    const getFilteredCount = () => {
        if (!searchQuery.trim()) return accords.length;
        return accords.filter(accord =>
            accord.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).length;
    };

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background />
            <div className="relative z-10 font-['Viaoda_Libre',serif] text-base sm:text-lg md:text-xl lg:text-2xl">
                <div className={theme.text.primary}>
                    <Header page={4} />

                    <main className="mt-5 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pt-[80px] sm:pt-[100px] md:pt-[160px]">
                        {/* Hero Section */}
                        <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                            <HeroSection primaryText={"Explore Accords"} secondaryText={"Discover the harmonic structures that define fragrance families"}/>

                            <SearchBar size={2} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search for accords..."} />

                            <SortButtons handleSortChange={handleSortChange} sortBy={sortBy} />

                            <ResultsCounter displayedCount={displayedAccords.length} filteredCount={getFilteredCount()} type={"accords"}/>
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
                                                    animationDelay: `${(index % ACCORDS_PER_PAGE) * 50}ms`,
                                                    animationFillMode: 'both'
                                                }}
                                            >
                                                <GeneralCard
                                                    name={accord.name}
                                                    total={accord.totalAppearances}
                                                    message={"Click to explore fragrances with this accord"}
                                                    onClick={() => handleAccordClick(accord)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <LoadMoreButton onClick={loadMoreAccords} disabled={loadingMore} message={"Load More Accords"} />
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
                        <Footer/>
                    </main>
                </div>
            </div>
            <style jsx>{`
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
            `}</style>
        </div>
    );
};

export default AllAccordsPage;
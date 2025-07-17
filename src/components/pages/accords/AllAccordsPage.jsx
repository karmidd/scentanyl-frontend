import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import LoadingPage from "../LoadingPage.jsx";
import GeneralCard from "../../cards/GeneralCard.jsx";

const AllAccordsPage = () => {
    const navigate = useNavigate();
    const [accords, setAccords] = useState([]);
    const [displayedAccords, setDisplayedAccords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState('alphabetical'); // 'alphabetical' or 'popularity'

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

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(accord =>
                accord.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort accords
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
        return (
            <LoadingPage/>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background />
            <div className="relative z-10 font-['Viaoda_Libre',serif] text-2xl">
                <div className="text-white">
                    {/* Header */}
                    <Header page={4} />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 py-8 pt-[160px]">
                        {/* Hero Section */}
                        <div className="space-y-8 mb-16">
                            <div className="space-y-6 text-center">
                                <BlurText
                                    text="Explore Accords"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-6xl lg:text-7xl font-bold leading-tight"
                                />
                                <BlurText
                                    text="Discover the harmonic structures that define fragrance families"
                                    delay={80}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-2xl text-gray-400 max-w-3xl mx-auto"
                                />
                            </div>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search for accords..."
                                        className="w-full px-8 py-6 text-2xl bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:border-blue-400 transition-all duration-300 group-hover:border-blue-600 placeholder-gray-500"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-800 hover:bg-blue-700 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>

                            {/* Sort Options */}
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => handleSortChange('alphabetical')}
                                    className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-lg ${
                                        sortBy === 'alphabetical'
                                            ? 'bg-blue-800 text-white shadow-lg'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    Alphabetical
                                </button>
                                <button
                                    onClick={() => handleSortChange('popularity')}
                                    className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-lg ${
                                        sortBy === 'popularity'
                                            ? 'bg-blue-800 text-white shadow-lg'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    Most Popular
                                </button>
                            </div>

                            {/* Results Counter */}
                            <div className="text-center">
                                <BlurText
                                    text={`Showing ${displayedAccords.length} of ${getFilteredCount()} accords`}
                                    delay={150}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-xl text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Accords Grid */}
                        <div className="space-y-8">
                            {displayedAccords.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="flex justify-center pt-12">
                                            <button
                                                onClick={loadMoreAccords}
                                                disabled={loadingMore}
                                                className="cursor-pointer relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                                <div className="relative flex items-center space-x-3">
                                                    {loadingMore ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                            <span>Loading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Load More Accords</span>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <BlurText
                                        text="No accords found"
                                        delay={100}
                                        animateBy="words"
                                        direction="bottom"
                                        className="flex justify-center text-3xl text-gray-400 mb-4"
                                    />
                                    <p className="text-gray-500 text-xl">
                                        Try adjusting your search terms
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Call to Action */}
                        <div className="text-center space-y-6 pt-16">
                            <BlurText
                                text="Ready to Discover Your Signature Scent?"
                                delay={300}
                                animateBy="words"
                                direction="bottom"
                                className="flex justify-center text-3xl font-bold text-white"
                            />
                            <div className="flex gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="cursor-pointer bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Explore Fragrances
                                </button>
                                <button
                                    onClick={() => navigate('/brands')}
                                    className="cursor-pointer border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Browse Brands
                                </button>
                            </div>
                        </div>
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
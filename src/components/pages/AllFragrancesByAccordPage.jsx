import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Background from "../primary/Background.jsx";
import Header from "../primary/Header.jsx";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../cards/FragranceCard.jsx";
import LoadingPage from "./LoadingPage.jsx";

const AllFragrancesByAccordPage = () => {
    const { accord } = useParams();
    const navigate = useNavigate();
    const [fragrances, setFragrances] = useState([]);
    const [displayedFragrances, setDisplayedFragrances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedGender, setSelectedGender] = useState('all');

    const FRAGRANCES_PER_PAGE = 20;

    useEffect(() => {
        if (accord) {
            fetchAccordFragrances();
        }
    }, [accord]);

    useEffect(() => {
        filterFragrances();
    }, [searchQuery, selectedGender, fragrances]);

    const fetchAccordFragrances = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/accords/${encodeURIComponent(accord)}`);
            const data = await response.json();
            setFragrances(data);

            setDisplayedFragrances(data.slice(0, FRAGRANCES_PER_PAGE));
            setHasMore(data.length > FRAGRANCES_PER_PAGE);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accord fragrances:', error);
            setLoading(false);
        }
    };

    const filterFragrances = () => {
        let filtered = fragrances;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(fragrance =>
                fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

            // Apply same filters as in filterFragrances
            if (searchQuery.trim()) {
                filtered = filtered.filter(fragrance =>
                    fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    const getFilteredCount = () => {
        let filtered = fragrances;

        if (searchQuery.trim()) {
            filtered = filtered.filter(fragrance =>
                fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    const getGenderCounts = () => {
        const counts = {
            all: fragrances.length,
            men: 0,
            women: 0,
            unisex: 0
        };

        fragrances.forEach(fragrance => {
            const gender = fragrance.gender?.toLowerCase();
            if (gender === 'men') counts.men++;
            else if (gender === 'women') counts.women++;
            else if (gender === 'unisex') counts.unisex++;
        });

        return counts;
    };

    if (loading) {
        return (
            <LoadingPage/>
        );
    }

    const genderCounts = getGenderCounts();

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
                                    text={`${accord.charAt(0).toUpperCase() + accord.slice(1)} Accord`}
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-6xl lg:text-7xl font-bold leading-tight"
                                />
                                <BlurText
                                    text="Discover all fragrances featuring this distinctive accord"
                                    delay={80}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-2xl text-gray-400 max-w-3xl mx-auto"
                                />
                            </div>

                            {/* Accord Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-700">
                                    <div className="text-3xl font-bold text-blue-400">{genderCounts.all}</div>
                                    <div className="text-sm text-gray-400">Total Fragrances</div>
                                </div>
                                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-700">
                                    <div className="text-3xl font-bold text-green-400">{genderCounts.men}</div>
                                    <div className="text-sm text-gray-400">Men's</div>
                                </div>
                                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-700">
                                    <div className="text-3xl font-bold text-pink-400">{genderCounts.women}</div>
                                    <div className="text-sm text-gray-400">Women's</div>
                                </div>
                                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-700">
                                    <div className="text-3xl font-bold text-purple-400">{genderCounts.unisex}</div>
                                    <div className="text-sm text-gray-400">Unisex</div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search fragrances, brands, or notes..."
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

                            {/* Gender Filter */}
                            <div className="flex justify-center space-x-4">
                                {['all', 'men', 'women', 'unisex'].map((gender) => (
                                    <button
                                        key={gender}
                                        onClick={() => handleGenderChange(gender)}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-lg cursor-pointer ${
                                            selectedGender === gender
                                                ? 'bg-blue-800 text-white shadow-lg'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Results Counter */}
                            <div className="text-center">
                                <BlurText
                                    text={`Showing ${displayedFragrances.length} of ${getFilteredCount()} fragrances`}
                                    delay={150}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-xl text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Fragrances Grid */}
                        <div className="space-y-8">
                            {displayedFragrances.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                                        <div className="flex justify-center pt-12">
                                            <button
                                                onClick={loadMoreFragrances}
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
                                                            <span>Load More Fragrances</span>
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
                                        text="No fragrances found"
                                        delay={100}
                                        animateBy="words"
                                        direction="bottom"
                                        className="flex justify-center text-3xl text-gray-400 mb-4"
                                    />
                                    <p className="text-gray-500 text-xl">
                                        Try adjusting your search terms or filters
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Back to Accords Button */}
                        <div className="text-center space-y-6 pt-16">
                            <BlurText
                                text="Explore More Accords"
                                delay={300}
                                animateBy="words"
                                direction="bottom"
                                className="flex justify-center text-3xl font-bold text-white"
                            />
                            <div className="flex gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/accords')}
                                    className="cursor-pointer bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Back to All Accords
                                </button>
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="cursor-pointer border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Explore All Fragrances
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

export default AllFragrancesByAccordPage;
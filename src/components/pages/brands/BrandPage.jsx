import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import LoadingPage from "../LoadingPage.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import GenderFilterButtons from "../../utils/GenderFilterButtons.jsx";

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
    }, [searchQuery, selectedGender, fragrances]);

    const fetchBrandData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [brandInfoResponse, fragrancesResponse] = await Promise.all([
                fetch(`http://localhost:8080/brands/${encodeURIComponent(brand)}/info`),
                fetch(`http://localhost:8080/brands/${encodeURIComponent(brand)}`)
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

    const filterFragrances = () => {
        let filtered = fragrances;

        if (searchQuery.trim()) {
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

            if (searchQuery.trim()) {
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

    const getFilteredCount = () => {
        let filtered = fragrances;

        if (searchQuery.trim()) {
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
                                    className="flex justify-center text-3xl sm:text-4xl text-red-400 mb-2 sm:mb-3 md:mb-4"
                                />
                                <p className="text-gray-500 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8">
                                    The brand "{brand}" could not be found.
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
        <div className="relative min-h-screen overflow-hidden">
            <Background />
            <div className="relative z-10 font-['Viaoda_Libre',serif] text-base sm:text-lg md:text-xl lg:text-2xl">
                <div className={theme.text.primary}>
                    <Header page={2} />

                    <main className="mt-5 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pt-[80px] sm:pt-[100px] md:pt-[160px]">
                        {/* Brand Info Section */}
                        {brandInfo && (
                            <div className="space-y-6 sm:space-y-8 md:space-y-10 mb-8 sm:mb-12 md:mb-16">
                                <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
                                    <BlurText
                                        text={brandInfo.name}
                                        delay={100}
                                        animateBy="words"
                                        direction="top"
                                        className="flex justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight px-2"
                                    />
                                    {brandInfo.country && (
                                        <div className="inline-flex items-center">
                                            <BlurText
                                                text={`From `}
                                                delay={150}
                                                animateBy="words"
                                                direction="bottom"
                                                className={`flex justify-center text-base sm:text-lg md:text-xl lg:text-2xl ${theme.text.secondary}`}
                                            />
                                            <BlurText
                                                text={`${brandInfo.country}`}
                                                delay={150}
                                                animateBy="words"
                                                direction="bottom"
                                                className={`flex justify-center font-bold text-base sm:text-lg md:text-xl lg:text-2xl ${theme.text.accent}`}
                                            />
                                        </div>
                                    )}
                                    {brandInfo.parent && (
                                        <BlurText
                                            text={`Part of ${brandInfo.parent}`}
                                            delay={200}
                                            animateBy="words"
                                            direction="bottom"
                                            className={`flex justify-center text-sm sm:text-base md:text-lg lg:text-xl ${theme.text.secondary}`}
                                        />
                                    )}
                                </div>

                                {/* Brand Image */}
                                {brandInfo.image && (
                                    <div className="flex justify-center px-4">
                                        <img
                                            src={brandInfo.image}
                                            alt={brandInfo.name}
                                            className="max-w-[150px] sm:max-w-[200px] md:max-w-xs max-h-32 sm:max-h-40 md:max-h-50 object-contain rounded-lg shadow-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Search and Filter Section */}
                        <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                            <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center">
                                <BlurText
                                    text={`Discover all fragrances from ${brandInfo?.name || brand}`}
                                    delay={300}
                                    animateBy="words"
                                    direction="bottom"
                                    className={`flex justify-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2`}
                                />
                            </div>

                            <SearchBar size={2} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search fragrances, notes, or accords..."}/>

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
                                        <div className="flex justify-center pt-6 sm:pt-8 md:pt-12">
                                            <button
                                                onClick={loadMoreFragrances}
                                                disabled={loadingMore}
                                                className="cursor-pointer group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 text-base sm:text-lg md:text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg sm:rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg sm:rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                                <div className="relative flex items-center space-x-2 sm:space-x-3">
                                                    {loadingMore ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-white"></div>
                                                            <span>Loading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Load More Fragrances</span>
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <div className="text-center py-8 sm:py-12 md:py-16">
                                    <BlurText
                                        text="No fragrances found"
                                        delay={100}
                                        animateBy="words"
                                        direction="bottom"
                                        className="flex justify-center text-2xl sm:text-3xl text-gray-400 mb-2 sm:mb-3 md:mb-4"
                                    />
                                    <p className="text-gray-500 text-base sm:text-lg md:text-xl">
                                        {searchQuery || selectedGender !== 'all'
                                            ? 'Try adjusting your search terms or filters'
                                            : `No fragrances available for ${brandInfo?.name || brand}`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Call to Action */}
                        <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 pt-8 sm:pt-12 md:pt-16">
                            <BlurText
                                text="Discover More Brands"
                                delay={400}
                                animateBy="words"
                                direction="bottom"
                                className="flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                            />
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl"
                                >
                                    Browse All Fragrances
                                </button>
                                <button
                                    onClick={() => navigate('/collection')}
                                    className="border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl"
                                >
                                    Start Your Collection
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

export default BrandPage;
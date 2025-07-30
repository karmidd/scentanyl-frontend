import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import GenderFilterButtons from "../../utils/GenderFilterButtons.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import LoadMoreButton from "../../utils/LoadMoreButton.jsx";

const AccordPage = () => {
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
    const { theme } = useTheme();
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
        return <LoadingPage/>;
    }

    const genderCounts = getGenderCounts();

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background />
            <div className="relative z-10 font-['Viaoda_Libre',serif] text-base sm:text-lg md:text-xl lg:text-2xl">
                <div className={theme.text.primary}>
                    <Header page={4} />

                    <main className="mt-5 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pt-[80px] sm:pt-[100px] md:pt-[160px]">
                        {/* Hero Section */}
                        <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                            <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center">
                                <BlurText
                                    text={`${accord.split(/(\s|\(|\))/).map(w => /^[a-zA-Z]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w).join('')} Accord`}
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight px-2"
                                />
                                <BlurText
                                    text="Discover all fragrances featuring this distinctive accord"
                                    delay={80}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                                />
                            </div>

                            {/* Accord Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                                <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{genderCounts.all}</div>
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

                            <SearchBar size={3} onChange={handleSearchChange} value={searchQuery} onSubmit={handleSearch} message={"Search fragrances, brands, or notes..."}/>

                            <GenderFilterButtons onClick={handleGenderChange} selectedGender={selectedGender}/>

                            <ResultsCounter displayedCount={displayedFragrances.length} filteredCount={getFilteredCount()} type={"fragrances"} />
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
                                        <LoadMoreButton disabled={loadingMore} onClick={loadMoreFragrances} message={"Load more fragrances"}/>
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
                                        Try adjusting your search terms or filters
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Back to Accords Button */}
                        <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 pt-8 sm:pt-12 md:pt-16">
                            <BlurText
                                text="Explore More Accords"
                                delay={300}
                                animateBy="words"
                                direction="bottom"
                                className="flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                            />
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/accords')}
                                    className={`cursor-pointer ${theme.button.primary} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl`}
                                >
                                    Back to All Accords
                                </button>
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="cursor-pointer border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl"
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

export default AccordPage;
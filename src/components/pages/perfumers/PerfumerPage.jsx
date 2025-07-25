import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/LoadMoreButton.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import GenderFilterButtons from "../../utils/GenderFilterButtons.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";

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
    }, [searchQuery, selectedGender, fragrances]);

    const fetchPerfumerData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:8080/perfumers/${encodeURIComponent(perfumer)}`);

            if (!response.ok) {
                throw new Error('Perfumer not found');
            }

            const fragrancesData = await response.json();

            // Calculate gender counts
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

    const filterFragrances = () => {
        let filtered = fragrances;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(fragrance =>
                fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen overflow-hidden">
                <Background />
                <div className="relative z-10 font-['Viaoda_Libre',serif] text-2xl">
                    <div className="text-white">
                        <Header page={5} />
                        <main className="max-w-7xl mx-auto px-4 py-8 pt-[160px]">
                            <div className="text-center py-16">
                                <BlurText
                                    text="Perfumer Not Found"
                                    delay={100}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-4xl text-red-400 mb-4"
                                />
                                <p className="text-gray-500 text-xl mb-8">
                                    The perfumer "{perfumer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}" could not be found.
                                </p>
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
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
            <div className="relative z-10 font-['Viaoda_Libre',serif] text-2xl">
                <div className={theme.text.primary}>
                    {/* Header */}
                    <Header page={5} />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 py-8 pt-[160px]">
                        {/* Perfumer Info Section */}
                        <div className="space-y-10 mb-16">
                            <div className="text-center space-y-6">
                                <BlurText
                                    text={perfumer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-6xl lg:text-7xl text-white font-bold leading-tight"
                                />

                                {/* Total Fragrances Counter */}
                                <BlurText
                                    text={`${genderCounts.total} ${genderCounts.total === 1 ? 'Fragrance' : 'Fragrances'} Created`}
                                    delay={150}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-2xl text-gray-200"
                                />

                                {/* Gender Statistics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                                    <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                        <div className="text-3xl font-bold text-blue-500">{genderCounts.total}</div>
                                        <div className={`text-sm ${theme.text.secondary}`}>Total Fragrances</div>
                                    </div>
                                    <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                        <div className="text-3xl font-bold text-green-500">{genderCounts.men}</div>
                                        <div className={`text-sm ${theme.text.secondary}`}>Men's</div>
                                    </div>
                                    <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                        <div className="text-3xl font-bold text-pink-500">{genderCounts.women}</div>
                                        <div className={`text-sm ${theme.text.secondary}`}>Women's</div>
                                    </div>
                                    <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                        <div className="text-3xl font-bold text-purple-500">{genderCounts.unisex}</div>
                                        <div className={`text-sm ${theme.text.secondary}`}>Unisex</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="space-y-8 mb-16">
                            <div className="space-y-6 text-center">
                                <BlurText
                                    text={`Explore all fragrances created by ${perfumer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`}
                                    delay={350}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-xl text-gray-200 max-w-2xl mx-auto"
                                />
                            </div>

                            {/* Search Bar */}
                            <SearchBar size={3} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search fragrances, brands, notes, or accords..."}/>

                            {/* Gender Filter */}
                            <GenderFilterButtons onClick={handleGenderChange} selectedGender={selectedGender}/>

                            {/* Results Counter */}
                            <ResultsCounter displayedCount={displayedFragrances.length} filteredCount={getFilteredCount()} type={"fragrances"}/>

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
                                        <LoadMoreButton onClick={loadMoreFragrances} disabled={loadingMore} message={"Load More Fragrances"}/>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <BlurText
                                        text="No fragrances found"
                                        delay={100}
                                        animateBy="words"
                                        direction="bottom"
                                        className="flex justify-center text-3xl text-gray-200 mb-4"
                                    />
                                    <p className="text-gray-500 text-xl">
                                        {searchQuery || selectedGender !== 'all'
                                            ? 'Try adjusting your search terms or filters'
                                            : `No fragrances available for ${perfumer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Call to Action */}
                        <div className="text-center space-y-6 pt-16">
                            <BlurText
                                text="Discover More Perfumers"
                                delay={450}
                                animateBy="words"
                                direction="bottom"
                                className="flex justify-center text-3xl font-bold text-white"
                            />
                            <div className="flex gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="cursor-pointer bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Browse All Fragrances
                                </button>
                                <button
                                    onClick={() => navigate('/collection')}
                                    className="cursor-pointer border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
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

export default PerfumerPage;
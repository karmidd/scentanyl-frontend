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

const NotePage = () => {
    const { note } = useParams();
    const navigate = useNavigate();
    const [fragrances, setFragrances] = useState([]);
    const [displayedFragrances, setDisplayedFragrances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedGender, setSelectedGender] = useState('all');
    const [selectedPosition, setSelectedPosition] = useState('all');
    const [noteStats, setNoteStats] = useState({
        total: 0,
        topNotes: 0,
        middleNotes: 0,
        baseNotes: 0,
        uncategorizedNotes: 0
    });
    const { theme } = useTheme();

    const FRAGRANCES_PER_PAGE = 20;

    useEffect(() => {
        if (note) {
            fetchNoteFragrances();
        }
    }, [note]);

    useEffect(() => {
        filterFragrances();
    }, [searchQuery, selectedGender, selectedPosition, fragrances]);

    const fetchNoteFragrances = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/notes/${encodeURIComponent(note)}`);
            const data = await response.json();
            setFragrances(data);

            // Calculate note statistics
            const stats = categorizeNoteUsage(data, note);
            setNoteStats(stats);

            setDisplayedFragrances(data.slice(0, FRAGRANCES_PER_PAGE));
            setHasMore(data.length > FRAGRANCES_PER_PAGE);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching note fragrances:', error);
            setLoading(false);
        }
    };

    const categorizeNoteUsage = (fragrances, note) => {
        const noteUsage = {
            total: fragrances.length,
            topNotes: 0,
            middleNotes: 0,
            baseNotes: 0,
            uncategorizedNotes: 0
        };

        fragrances.forEach(fragrance => {
            const noteLower = note.toLowerCase();

            if (fragrance.topNotes && fragrance.topNotes.toLowerCase().includes(noteLower)) {
                noteUsage.topNotes++;
            }
            if (fragrance.middleNotes && fragrance.middleNotes.toLowerCase().includes(noteLower)) {
                noteUsage.middleNotes++;
            }
            if (fragrance.baseNotes && fragrance.baseNotes.toLowerCase().includes(noteLower)) {
                noteUsage.baseNotes++;
            }
            if (fragrance.uncategorizedNotes && fragrance.uncategorizedNotes.toLowerCase().includes(noteLower)) {
                noteUsage.uncategorizedNotes++;
            }
        });

        return noteUsage;
    };

    const filterFragrances = () => {
        let filtered = fragrances;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(fragrance =>
                fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by gender
        if (selectedGender !== 'all') {
            filtered = filtered.filter(fragrance =>
                fragrance.gender?.toLowerCase() === selectedGender.toLowerCase()
            );
        }

        // Filter by note position
        if (selectedPosition !== 'all') {
            const noteLower = note.toLowerCase();
            filtered = filtered.filter(fragrance => {
                switch (selectedPosition) {
                    case 'top':
                        return fragrance.topNotes && fragrance.topNotes.toLowerCase().includes(noteLower);
                    case 'middle':
                        return fragrance.middleNotes && fragrance.middleNotes.toLowerCase().includes(noteLower);
                    case 'base':
                        return fragrance.baseNotes && fragrance.baseNotes.toLowerCase().includes(noteLower);
                    case 'uncategorized':
                        return fragrance.uncategorizedNotes && fragrance.uncategorizedNotes.toLowerCase().includes(noteLower);
                    default:
                        return true;
                }
            });
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
                    fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (selectedGender !== 'all') {
                filtered = filtered.filter(fragrance =>
                    fragrance.gender?.toLowerCase() === selectedGender.toLowerCase()
                );
            }

            if (selectedPosition !== 'all') {
                const noteLower = note.toLowerCase();
                filtered = filtered.filter(fragrance => {
                    switch (selectedPosition) {
                        case 'top':
                            return fragrance.topNotes && fragrance.topNotes.toLowerCase().includes(noteLower);
                        case 'middle':
                            return fragrance.middleNotes && fragrance.middleNotes.toLowerCase().includes(noteLower);
                        case 'base':
                            return fragrance.baseNotes && fragrance.baseNotes.toLowerCase().includes(noteLower);
                        case 'uncategorized':
                            return fragrance.uncategorizedNotes && fragrance.uncategorizedNotes.toLowerCase().includes(noteLower);
                        default:
                            return true;
                    }
                });
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

    const handlePositionChange = (position) => {
        setSelectedPosition(position);
        setCurrentPage(1);
    };

    const getFilteredCount = () => {
        let filtered = fragrances;

        if (searchQuery.trim()) {
            filtered = filtered.filter(fragrance =>
                fragrance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fragrance.accords?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedGender !== 'all') {
            filtered = filtered.filter(fragrance =>
                fragrance.gender?.toLowerCase() === selectedGender.toLowerCase()
            );
        }

        if (selectedPosition !== 'all') {
            const noteLower = note.toLowerCase();
            filtered = filtered.filter(fragrance => {
                switch (selectedPosition) {
                    case 'top':
                        return fragrance.topNotes && fragrance.topNotes.toLowerCase().includes(noteLower);
                    case 'middle':
                        return fragrance.middleNotes && fragrance.middleNotes.toLowerCase().includes(noteLower);
                    case 'base':
                        return fragrance.baseNotes && fragrance.baseNotes.toLowerCase().includes(noteLower);
                    case 'uncategorized':
                        return fragrance.uncategorizedNotes && fragrance.uncategorizedNotes.toLowerCase().includes(noteLower);
                    default:
                        return true;
                }
            });
        }

        return filtered.length;
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
                <div className={theme.text.primary}>
                    {/* Header */}
                    <Header page={3} />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 py-8 pt-[160px]">
                        {/* Hero Section */}
                        <div className="space-y-8 mb-16">
                            <div className="space-y-6 text-center">
                                <BlurText
                                    text={`Fragrances with ${note.split(/(\s|\(|\))/).map(w => /^[a-zA-Z]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w).join('')
                                    }`}
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-white text-6xl lg:text-7xl font-bold leading-tight"
                                />
                                <BlurText
                                    text="Discover all fragrances featuring this beautiful note"
                                    delay={80}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-2xl text-gray-300 max-w-3xl mx-auto"
                                />
                            </div>

                            {/* Note Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-8">
                                <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                    <div className="text-3xl font-bold text-blue-500">{noteStats.total}</div>
                                    <div className={`text-sm ${theme.text.secondary}`}>Total</div>
                                </div>
                                <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                    <div className="text-3xl font-bold text-green-500">{noteStats.topNotes}</div>
                                    <div className={`text-sm ${theme.text.secondary}`}>As a Top Note</div>
                                </div>
                                <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                    <div className="text-3xl font-bold text-yellow-500">{noteStats.middleNotes}</div>
                                    <div className={`text-sm ${theme.text.secondary}`}>As a Middle Note</div>
                                </div>
                                <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                    <div className="text-3xl font-bold text-purple-500">{noteStats.baseNotes}</div>
                                    <div className={`text-sm ${theme.text.secondary}`}>As a Base Note</div>
                                </div>
                                <div className={`${theme.card.primary} rounded-xl p-4 text-center border border-gray-700`}>
                                    <div className="text-3xl font-bold text-orange-500">{noteStats.uncategorizedNotes}</div>
                                    <div className={`text-sm ${theme.text.secondary}`}>As an Uncategorized Note</div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <SearchBar size={3} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search fragrances, brands, or accords..."}/>

                            {/* Gender Filter */}
                            <GenderFilterButtons onClick={handleGenderChange} selectedGender={selectedGender} />

                            {/* Position Filter */}
                            <div className="flex justify-center space-x-4 flex-wrap">
                                {['all', 'top', 'middle', 'base', 'uncategorized'].map((position) => (
                                    <button
                                        key={position}
                                        onClick={() => handlePositionChange(position)}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-lg cursor-pointer mb-2 ${
                                            selectedPosition === position
                                                ? 'bg-green-700 text-white shadow-lg'
                                                : theme.card.primary
                                        }`}
                                    >
                                        {position === 'all' ? 'Anywhere' :
                                            position === 'top' ? 'As a Top Note' :
                                                position === 'middle' ? 'As a Middle Note' :
                                                    position === 'base' ? 'As a Base Note' :
                                                        'As an Uncategorized Note'}
                                    </button>
                                ))}
                            </div>

                            {/* Results Counter */}
                            <ResultsCounter displayedCount={displayedFragrances.length} filteredCount={getFilteredCount()} type={"fragrances"} />

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

                        {/* Back to Notes Button */}
                        <div className="text-center space-y-6 pt-16">
                            <BlurText
                                text="Explore More Notes"
                                delay={300}
                                animateBy="words"
                                direction="bottom"
                                className="flex justify-center text-3xl font-bold text-white"
                            />
                            <div className="flex gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/notes')}
                                    className="cursor-pointer bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Back to All Notes
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

export default NotePage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import GenderFilterButtons from "../../utils/buttons/GenderFilterButtons.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import PageLayout from "../../utils/PageLayout.jsx";

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
        return <LoadingPage/>;
    }

    return (
        <PageLayout headerNum={3} style={<style jsx>{`
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
                <HeroSection secondaryText={"Discover all fragrances featuring this beautiful note"} primaryText={`Fragrances with ${note.split(/(\s|\(|\))/).map(w => /^[a-zA-Z]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w).join('')}`}/>

                {/* Note Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4 max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                    <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">{noteStats.total}</div>
                        <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>Total</div>
                    </div>
                    <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500">{noteStats.topNotes}</div>
                        <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>As a Top Note</div>
                    </div>
                    <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-500">{noteStats.middleNotes}</div>
                        <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>As a Middle Note</div>
                    </div>
                    <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700`}>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-500">{noteStats.baseNotes}</div>
                        <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>As a Base Note</div>
                    </div>
                    <div className={`${theme.card.primary} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-gray-700 col-span-2 sm:col-span-1`}>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500">{noteStats.uncategorizedNotes}</div>
                        <div className={`text-xs sm:text-sm ${theme.text.secondary}`}>As an Uncategorized Note</div>
                    </div>
                </div>

                <SearchBar size={3} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search fragrances, brands, or accords..."}/>

                <GenderFilterButtons onClick={handleGenderChange} selectedGender={selectedGender} />

                {/* Position Filter */}
                <div className="flex justify-center space-x-2 sm:space-x-3 md:space-x-4 flex-wrap gap-y-2 px-2">
                    {['all', 'top', 'middle', 'base', 'uncategorized'].map((position) => (
                        <button
                            key={position}
                            onClick={() => handlePositionChange(position)}
                            className={`px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer mb-2 ${
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
                            Try adjusting your search terms or filters
                        </p>
                    </div>
                )}
            </div>

            {/* Back to Notes Button */}
            <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 pt-8 sm:pt-12 md:pt-16">
                <BlurText
                    text="Explore More Notes"
                    delay={300}
                    animateBy="words"
                    direction="bottom"
                    className="flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                    <button
                        onClick={() => navigate('/notes')}
                        className={`cursor-pointer ${theme.button.primary} ${theme.shadow.button} text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl`}
                    >
                        Back to All Notes
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default NotePage;
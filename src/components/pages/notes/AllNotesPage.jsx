import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import NoteCard from "../../cards/NoteCard.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/LoadMoreButton.jsx";
import SortButtons from "../../utils/SortButtons.jsx";

const AllNotesPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [displayedNotes, setDisplayedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState('alphabetical');
    const { theme } = useTheme();

    const NOTES_PER_PAGE = 20;

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        if (!loading) {
            filterAndSortNotes();
        }
    }, [searchQuery, sortBy, notes]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/notes');
            const notesArray = await response.json();
            setNotes(notesArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setLoading(false);
        }
    };

    const filterAndSortNotes = () => {
        let filtered = notes;

        if (searchQuery.trim()) {
            filtered = filtered.filter(note =>
                note.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === 'alphabetical') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'popularity') {
            filtered.sort((a, b) => b.totalAppearances - a.totalAppearances);
        }

        setDisplayedNotes(filtered.slice(0, NOTES_PER_PAGE * currentPage));
        setHasMore(filtered.length > NOTES_PER_PAGE * currentPage);
    };

    const loadMoreNotes = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        setTimeout(() => {
            let filtered = notes;

            if (searchQuery.trim()) {
                filtered = filtered.filter(note =>
                    note.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (sortBy === 'alphabetical') {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === 'popularity') {
                filtered.sort((a, b) => b.totalAppearances - a.totalAppearances);
            }

            const newNotes = filtered.slice(0, NOTES_PER_PAGE * nextPage);
            setDisplayedNotes(newNotes);
            setCurrentPage(nextPage);
            setHasMore(filtered.length > NOTES_PER_PAGE * nextPage);
            setLoadingMore(false);
        }, 800);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        filterAndSortNotes();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        setCurrentPage(1);
    };

    const handleNoteClick = (note) => {
        navigate(`/notes/${encodeURIComponent(note.name)}`);
    };

    const getFilteredCount = () => {
        if (!searchQuery.trim()) return notes.length;
        return notes.filter(note =>
            note.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <Header page={3} />

                    <main className="mt-5 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pt-[80px] sm:pt-[100px] md:pt-[160px]">
                        {/* Hero Section */}
                        <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                            <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center">
                                <BlurText
                                    text="Explore Notes"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2"
                                />
                                <BlurText
                                    text="Discover the building blocks of your favorite fragrances"
                                    delay={80}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center px-2"
                                />
                            </div>

                            <SearchBar size={2} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search for notes..."} />

                            <SortButtons handleSortChange={handleSortChange} sortBy={sortBy} />

                            <div className="text-center">
                                <BlurText
                                    text={`Showing ${displayedNotes.length} of ${getFilteredCount()} notes`}
                                    delay={150}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-base sm:text-lg md:text-xl text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Notes Grid */}
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                            {displayedNotes.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                                        {displayedNotes.map((note, index) => (
                                            <div
                                                key={note.id}
                                                className="animate-fadeIn"
                                                style={{
                                                    animationDelay: `${(index % NOTES_PER_PAGE) * 50}ms`,
                                                    animationFillMode: 'both'
                                                }}
                                            >
                                                <NoteCard
                                                    note={note.name}
                                                    noteData={{
                                                        total: note.totalAppearances,
                                                        topNotes: note.topCount,
                                                        middleNotes: note.middleCount,
                                                        baseNotes: note.baseCount,
                                                        uncategorizedNotes: note.uncategorizedCount
                                                    }}
                                                    onClick={() => handleNoteClick(note)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <LoadMoreButton onClick={loadMoreNotes} disabled={loadingMore} message={"Load More Notes"} />
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 sm:py-12 md:py-16">
                                    <BlurText
                                        text="No notes found"
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

                        {/* Call to Action */}
                        <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 pt-8 sm:pt-12 md:pt-16">
                            <BlurText
                                text="Ready to Discover Your Signature Scent?"
                                delay={300}
                                animateBy="words"
                                direction="bottom"
                                className="flex justify-center text-2xl sm:text-3xl font-bold text-white px-2"
                            />
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="cursor-pointer bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl"
                                >
                                    Explore Fragrances
                                </button>
                                <button
                                    onClick={() => navigate('/brands')}
                                    className="cursor-pointer border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg md:text-xl"
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

export default AllNotesPage;
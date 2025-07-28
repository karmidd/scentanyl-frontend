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
import HeroSection from "../../utils/HeroSection.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";

const AllNotesPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [displayedNotes, setDisplayedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState('alphabetical'); // 'alphabetical' or 'popularity'
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

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(note =>
                note.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort notes
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
                            <HeroSection primaryText={"Explore Notes"} secondaryText={"Discover the building blocks of your favorite fragrances"} />

                            {/* Search Bar */}
                            <SearchBar size={2} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search for notes..."} />

                            {/* Sort Options */}
                            <SortButtons handleSortChange={handleSortChange} sortBy={sortBy} />

                            {/* Results Counter */}
                            <ResultsCounter type={"notes"} displayedCount={displayedNotes.length} filteredCount={getFilteredCount()} />

                        </div>

                        {/* Notes Grid */}
                        <div className="space-y-8">
                            {displayedNotes.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <LoadMoreButton onClick={loadMoreNotes} disabled={loadingMore} message={"Load More Notes"} />
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <BlurText
                                        text="No notes found"
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

export default AllNotesPage;
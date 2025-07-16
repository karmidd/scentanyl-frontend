import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from "../primary/Background.jsx";
import Header from "../primary/Header.jsx";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText.jsx";
import NoteCard from "../cards/NoteCard.jsx";
import LoadingPage from "./LoadingPage.jsx";

const AllNotesPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [notesData, setNotesData] = useState({});
    const [displayedNotes, setDisplayedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState('alphabetical'); // 'alphabetical' or 'popularity'

    const NOTES_PER_PAGE = 20;

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        if(!loading)
            filterAndSortNotes();
    }, [searchQuery, sortBy, notes, notesData]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/notes');
            const notesArray = await response.json();
            setNotes(notesArray);

            // Fetch fragrance data for each note
            await fetchNotesData(notesArray);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setLoading(false);
        }
    };

    const fetchNotesData = async (notesArray) => {
        const notesDataMap = {};
        // Process notes in batches to avoid overwhelming the server
        const batchSize = 10;
        for (let i = 0; i < notesArray.length; i += batchSize) {
            const batch = notesArray.slice(i, i + batchSize);
            const promises = batch.map(note => fetchNoteFragrances(note));
            const results = await Promise.all(promises);

            batch.forEach((note, index) => {
                notesDataMap[note] = results[index];
            });

            // Update state after each batch to show progress
            setNotesData(prev => ({ ...prev, ...notesDataMap }));
        }
    };

    const fetchNoteFragrances = async (note) => {
        try {
            const response = await fetch(`http://localhost:8080/notes/${encodeURIComponent(note)}`);
            const fragrances = await response.json();

            return categorizeNoteUsage(fragrances, note);
        } catch (error) {
            console.error(`Error fetching fragrances for note ${note}:`, error);
            return { total: 0, topNotes: 0, middleNotes: 0, baseNotes: 0, uncategorizedNotes: 0 };
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

    const filterAndSortNotes = () => {
        let filtered = notes;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(note =>
                note.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort notes
        if (sortBy === 'alphabetical') {
            filtered.sort((a, b) => a.localeCompare(b));
        } else if (sortBy === 'popularity') {
            filtered.sort((a, b) => {
                const aCount = notesData[a]?.total || 0;
                const bCount = notesData[b]?.total || 0;
                return bCount - aCount;
            });
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
                    note.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (sortBy === 'alphabetical') {
                filtered.sort((a, b) => a.localeCompare(b));
            } else if (sortBy === 'popularity') {
                filtered.sort((a, b) => {
                    const aCount = notesData[a]?.total || 0;
                    const bCount = notesData[b]?.total || 0;
                    return bCount - aCount;
                });
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
        navigate(`/notes/${encodeURIComponent(note)}`);
    };

    const getFilteredCount = () => {
        if (!searchQuery.trim()) return notes.length;
        return notes.filter(note =>
            note.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <Header page={3} />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 py-8 pt-[160px]">
                        {/* Hero Section */}
                        <div className="space-y-8 mb-16">
                            <div className="space-y-6 text-center">
                                <BlurText
                                    text="Explore Notes"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-6xl lg:text-7xl font-bold leading-tight"
                                />
                                <BlurText
                                    text="Discover the building blocks of your favorite fragrances"
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
                                        placeholder="Search for notes..."
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
                                    text={`Showing ${displayedNotes.length} of ${getFilteredCount()} notes`}
                                    delay={150}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-xl text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Notes Grid */}
                        <div className="space-y-8">
                            {displayedNotes.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {displayedNotes.map((note, index) => (
                                            <div
                                                key={note}
                                                className="animate-fadeIn"
                                                style={{
                                                    animationDelay: `${(index % NOTES_PER_PAGE) * 50}ms`,
                                                    animationFillMode: 'both'
                                                }}
                                            >
                                                <NoteCard
                                                    note={note}
                                                    noteData={notesData[note] || { total: 0, topNotes: 0, middleNotes: 0, baseNotes: 0, uncategorizedNotes: 0 }}
                                                    onClick={() => handleNoteClick(note)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="flex justify-center pt-12">
                                            <button
                                                onClick={loadMoreNotes}
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
                                                            <span>Load More Notes</span>
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
        </div>
    );
};

export default AllNotesPage;
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import NoteCard from "../../cards/NoteCard.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import SortButtons from "../../utils/buttons/SortButtons.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import {useItemFilter} from "../../../hooks/useItemFilter.jsx";
import {usePagination} from "../../../hooks/usePagination.jsx";


// Memoized NoteCard
const MemoizedNoteCard = memo(NoteCard, (prevProps, nextProps) => {
    return prevProps.note === nextProps.note &&
        prevProps.noteData.totalFragrances === nextProps.noteData.totalFragrances;
});

const AllNotesPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Use custom hooks
    const {
        setItems: setNotes,
        filteredItems: filteredNotes,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy
    } = useItemFilter(['alphabetical', 'fragranceCount']);

    const {
        displayedItems: displayedNotes,
        hasMore,
        isLoadingMore,
        loadMore,
        reset: resetPagination
    } = usePagination(filteredNotes, 20);

    useEffect(() => {
        fetchNotes();
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [searchQuery, sortBy, resetPagination]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/notes');
            const notesArray = await response.json();
            setNotes(notesArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setLoading(false);
        }
    };

    // Memoized callbacks
    const handleSearch = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    const handleSortChange = useCallback((newSortBy) => {
        setSortBy(newSortBy);
    }, [setSortBy]);

    const handleNoteClick = useCallback((note) => {
        navigate(`/notes/${encodeURIComponent(note.name)}`);
    }, [navigate]);

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
                <HeroSection primaryText={"Explore Notes"} secondaryText={"Discover the building blocks of your favorite fragrances"}/>

                <SearchBar
                    size={2}
                    onSubmit={handleSearch}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    message={"Search for notes..."}
                />

                <SortButtons handleSortChange={handleSortChange} sortBy={sortBy} />

                <div className="text-center">
                    <BlurText
                        text={`Showing ${displayedNotes.length} of ${filteredNotes.length} notes`}
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
                                        animationDelay: `${(index % 20) * 50}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <MemoizedNoteCard
                                        note={note.name}
                                        noteData={{
                                            totalFragrances: note.totalFragrances,
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
                            <LoadMoreButton onClick={loadMore} disabled={isLoadingMore} message={"Load More Notes"} />
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
        </PageLayout>
    );
};

export default AllNotesPage;
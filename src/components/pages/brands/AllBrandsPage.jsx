import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import BrandCard from "../../cards/BrandCard.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import SortButtons from "../../utils/buttons/SortButtons.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";
import {useBrandFilter} from "../../../hooks/useBrandFilter.jsx";
import {usePagination} from "../../../hooks/usePagination.jsx";


// Memoized BrandCard
const MemoizedBrandCard = memo(BrandCard, (prevProps, nextProps) => {
    return prevProps.brand.id === nextProps.brand.id;
});

const AllBrandsPage = () => {
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('alphabetical'); // Add sort state
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [countrySearchTerm, setCountrySearchTerm] = useState('');
    const [parentSearchTerm, setParentSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const { theme } = useTheme();
    const API_BASE_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        document.title = `Brands | Scentanyl`;
    }, []);

    // Use custom hooks
    const {
        setBrands,
        filteredBrands,
        searchQuery,
        setSearchQuery,
        selectedCountry,
        setSelectedCountry,
        selectedParent,
        setSelectedParent,
        uniqueCountries,
        uniqueParents,
        clearFilters
    } = useBrandFilter();

    // Sort the filtered brands based on current sort option
    const sortedBrands = React.useMemo(() => {
        const brandsToSort = [...filteredBrands];

        switch (sortBy) {
            case 'alphabetical':
                return brandsToSort.sort((a, b) => a.name.localeCompare(b.name));
            case 'fragranceCount':
                return brandsToSort.sort((a, b) => (b.totalFragrances || 0) - (a.totalFragrances || 0));
            default:
                return brandsToSort;
        }
    }, [filteredBrands, sortBy]);

    const {
        displayedItems: displayedBrands,
        hasMore,
        isLoadingMore,
        loadMore,
        reset: resetPagination
    } = usePagination(sortedBrands, 20); // Use sortedBrands instead of filteredBrands

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is on a dropdown button
            const isDropdownButton = event.target.closest('[data-dropdown-button]');

            if (!isDropdownButton && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
                setCountrySearchTerm('');
                setParentSearchTerm('');
            }
        };

        if (activeDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeDropdown]);

    // Reset pagination when filters or sorting changes
    useEffect(() => {
        resetPagination();
    }, [searchQuery, selectedCountry, selectedParent, sortBy, resetPagination]);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/brands`);
            const data = await response.json();
            setBrands(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const getFilteredItems = (items, searchTerm) => {
        if (!Array.isArray(items)) return [];
        if (!searchTerm) return items.slice(0, 30);
        return items.filter(item =>
            item && typeof item === 'string' && item.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 30);
    };

    const renderDropdown = (items, onSelect, type, searchTerm, setSearchTerm) => {
        if (!Array.isArray(items) || items.length === 0) {
            return (
                <div
                    ref={dropdownRef}
                    className={`absolute top-full left-0 mt-1 w-full ${theme.bg.input} border ${theme.border.primary} rounded-lg shadow-lg max-h-60 overflow-y-auto`}
                    style={{ zIndex: 9999 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-3 text-center text-sm text-gray-500">
                        No {type} available
                    </div>
                </div>
            );
        }

        const filteredItems = getFilteredItems(items, searchTerm);

        return (
            <div
                ref={dropdownRef}
                className={`absolute top-full left-0 mt-1 w-full ${theme.bg.input} border ${theme.border.primary} rounded-lg shadow-lg max-h-60 overflow-y-auto`}
                style={{ zIndex: 9999 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            e.stopPropagation();
                            setSearchTerm(e.target.value);
                        }}
                        placeholder={`Search ${type}...`}
                        className={`w-full px-3 py-2 text-sm ${theme.bg.input} ${theme.text.primary} border ${theme.border.primary} rounded focus:outline-none`}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                    />
                </div>
                <div className="max-h-40 overflow-y-auto">
                    {filteredItems.length > 0 ? (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onSelect('');
                                    setActiveDropdown(null);
                                    setSearchTerm('');
                                }}
                                className={`cursor-pointer w-full text-left px-3 py-2 text-sm ${theme.text.primary} hover:bg-blue-400 hover:${theme.text.secondary} transition-colors duration-200 border-b ${theme.border.primary}`}
                            >
                                All {type}
                            </button>
                            {filteredItems.map((item, index) => (
                                <button
                                    key={`${type}-${index}-${item}`}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onSelect(item);
                                        setActiveDropdown(null);
                                        setSearchTerm('');
                                    }}
                                    className={`cursor-pointer w-full text-left px-3 py-2 text-sm ${theme.text.primary} hover:bg-blue-400 hover:${theme.text.secondary} transition-colors duration-200`}
                                >
                                    {typeof item === 'string' ? item : (item?.name || 'Unknown')}
                                </button>
                            ))}
                        </>
                    ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                            No available {type} to select
                        </div>
                    )}
                </div>
            </div>
        );
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
    }, []);

    // FIX 1: Proper toggle handlers
    const handleCountryDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeDropdown === 'country') {
            setActiveDropdown(null);
            setCountrySearchTerm('');
        } else {
            setActiveDropdown('country');
            setParentSearchTerm('');
        }
    };

    const handleParentDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeDropdown === 'parent') {
            setActiveDropdown(null);
            setParentSearchTerm('');
        } else {
            setActiveDropdown('parent');
            setCountrySearchTerm('');
        }
    };

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <PageLayout headerNum={2} style={<style jsx>{`
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
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16 overflow-visible">
                <HeroSection primaryText={"Explore Brands"} secondaryText={"Discover fragrances from the world's most prestigious and emerging brands"}/>

                {/* Search Bar */}
                <SearchBar size={2} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search for brands..."} />

                {/* Filters Section  */}
                <div className="max-w-2xl mx-auto px-2 relative" style={{ zIndex: 11 }}>
                    <div className={`${theme.card.blur} border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6`}>
                        <div className="flex flex-row flex-wrap gap-3 sm:gap-4 items-end justify-center">
                            {/* Country Filter */}
                            <div className="flex flex-col space-y-1 sm:space-y-2 flex-1 min-w-[120px] relative">
                                <label className="text-xs sm:text-sm text-gray-300 font-medium">Country</label>
                                <button
                                    type="button"
                                    data-dropdown-button="country"
                                    onClick={handleCountryDropdown}
                                    className={`cursor-pointer px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 ${theme.bg.card} border border-gray-600 rounded-lg sm:rounded-xl focus:outline-none ${theme.border.focus} transition-all duration-300 ${theme.text.primary} text-sm sm:text-base w-full text-left flex justify-between items-center`}
                                >
                                    <span>{selectedCountry || 'All Countries'}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'country' ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeDropdown === 'country' && uniqueCountries.length > 0 &&
                                    renderDropdown(uniqueCountries, setSelectedCountry, 'countries', countrySearchTerm, setCountrySearchTerm)}
                            </div>

                            {/* Parent Company Filter */}
                            <div className="flex flex-col space-y-1 sm:space-y-2 flex-1 min-w-[120px] relative">
                                <label className="text-xs sm:text-sm text-gray-300 font-medium">Parent Company</label>
                                <button
                                    type="button"
                                    data-dropdown-button="parent"
                                    onClick={handleParentDropdown}
                                    className={`cursor-pointer px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 ${theme.bg.card} border border-gray-600 rounded-lg sm:rounded-xl focus:outline-none ${theme.border.focus} transition-all duration-300 ${theme.text.primary} text-sm sm:text-base w-full text-left flex justify-between items-center`}
                                >
                                    <span>{selectedParent || 'All Parents'}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'parent' ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeDropdown === 'parent' && uniqueParents.length > 0 &&
                                    renderDropdown(uniqueParents, setSelectedParent, 'parents', parentSearchTerm, setParentSearchTerm)}
                            </div>

                            {/* Clear Filters Button */}
                            {(searchQuery || selectedCountry || selectedParent) && (
                                <div className="flex flex-col space-y-1 sm:space-y-2">
                                    <label className="text-xs sm:text-sm text-transparent font-medium">Clear</label>
                                    <button
                                        onClick={clearFilters}
                                        className="cursor-pointer px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 font-medium text-sm sm:text-base whitespace-nowrap"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sort Buttons - FIX 2: Add relative positioning with lower z-index */}
                <div className="relative" style={{ zIndex: 10 }}>
                    <SortButtons
                        handleSortChange={handleSortChange}
                        sortBy={sortBy}
                    />
                </div>

                {/* Results Counter - FIX 2: Add relative positioning with lower z-index */}
                <div className="relative" style={{ zIndex: 10 }}>
                    <ResultsCounter displayedCount={displayedBrands.length} filteredCount={sortedBrands.length} type={"brands"} />
                </div>
            </div>

            {/* Brands Grid */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {displayedBrands.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                            {displayedBrands.map((brand, index) => (
                                <div
                                    key={brand.id || brand.name || index}
                                    className="animate-fadeIn"
                                    style={{
                                        animationDelay: `${(index % 20) * 50}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <MemoizedBrandCard brand={brand} />
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <LoadMoreButton onClick={loadMore} disabled={isLoadingMore} message={"Load More Brands"} />
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <BlurText
                            text="No brands found"
                            delay={100}
                            animateBy="words"
                            direction="bottom"
                            className="flex justify-center text-2xl sm:text-3xl text-gray-300 mb-2 sm:mb-3 md:mb-4"
                        />
                        <p className="text-gray-200 text-base sm:text-lg md:text-xl">
                            Try adjusting your search terms or filters
                        </p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default AllBrandsPage;
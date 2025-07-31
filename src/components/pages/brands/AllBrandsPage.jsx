import React, { useState, useEffect } from 'react';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import BrandCard from "../../cards/BrandCard.jsx";
import LoadingPage from "../primary/LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/buttons/LoadMoreButton.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../utils/PageLayout.jsx";

const AllBrandsPage = () => {
    const [brands, setBrands] = useState([]);
    const [displayedBrands, setDisplayedBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedParent, setSelectedParent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { theme } = useTheme();

    const BRANDS_PER_PAGE = 20;

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        filterBrands();
    }, [searchQuery, selectedCountry, selectedParent, brands]);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/brands');
            const data = await response.json();
            setBrands(data);
            setDisplayedBrands(data.slice(0, BRANDS_PER_PAGE));
            setHasMore(data.length > BRANDS_PER_PAGE);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setLoading(false);
        }
    };

    const getUniqueCountries = () => {
        const countries = brands
            .map(brand => brand.country)
            .filter(country => country !== null && country !== undefined && country !== '')
            .filter((country, index, self) => self.indexOf(country) === index)
            .sort();
        return countries;
    };

    const getUniqueParents = () => {
        const parents = brands
            .map(brand => brand.parent)
            .filter(parent => parent !== null && parent !== undefined && parent !== '')
            .filter((parent, index, self) => self.indexOf(parent) === index)
            .sort();
        return parents;
    };

    const filterBrands = () => {
        let filtered = brands;

        if (searchQuery.trim()) {
            filtered = filtered.filter(brand =>
                brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCountry) {
            filtered = filtered.filter(brand => brand.country === selectedCountry);
        }

        if (selectedParent) {
            filtered = filtered.filter(brand => brand.parent === selectedParent);
        }

        setDisplayedBrands(filtered.slice(0, BRANDS_PER_PAGE * currentPage));
        setHasMore(filtered.length > BRANDS_PER_PAGE * currentPage);
    };

    const loadMoreBrands = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        setTimeout(() => {
            let filtered = brands;

            if (searchQuery.trim()) {
                filtered = filtered.filter(brand =>
                    brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (selectedCountry) {
                filtered = filtered.filter(brand => brand.country === selectedCountry);
            }

            if (selectedParent) {
                filtered = filtered.filter(brand => brand.parent === selectedParent);
            }

            const newBrands = filtered.slice(0, BRANDS_PER_PAGE * nextPage);
            setDisplayedBrands(newBrands);
            setCurrentPage(nextPage);
            setHasMore(filtered.length > BRANDS_PER_PAGE * nextPage);
            setLoadingMore(false);
        }, 800);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        filterBrands();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setCurrentPage(1);
    };

    const handleParentChange = (e) => {
        setSelectedParent(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCountry('');
        setSelectedParent('');
        setCurrentPage(1);
    };

    const getFilteredBrandsCount = () => {
        let filtered = brands;

        if (searchQuery.trim()) {
            filtered = filtered.filter(brand =>
                brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCountry) {
            filtered = filtered.filter(brand => brand.country === selectedCountry);
        }

        if (selectedParent) {
            filtered = filtered.filter(brand => brand.parent === selectedParent);
        }

        return filtered.length;
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
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <HeroSection primaryText={"Explore Brands"} secondaryText={"Discover fragrances from the world's most prestigious and emerging brands"}/>

                {/* Search Bar */}
                <SearchBar size={2} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search for brands..."} />

                {/* Filters Section */}
                <div className="max-w-2xl mx-auto px-2">
                    <div className={`${theme.card.blur} border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6`}>
                        <div className="flex flex-row flex-wrap gap-3 sm:gap-4 items-end justify-center">
                            {/* Country Filter */}
                            <div className="flex flex-col space-y-1 sm:space-y-2 flex-1 min-w-[120px]">
                                <label className="text-xs sm:text-sm text-gray-300 font-medium">Country</label>
                                <select
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    className={`cursor-pointer px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 ${theme.bg.card} border border-gray-600 rounded-lg sm:rounded-xl focus:outline-none ${theme.border.focus} transition-all duration-300 ${theme.text.primary} text-sm sm:text-base w-full`}
                                >
                                    <option value="">All Countries</option>
                                    {getUniqueCountries().map(country => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Parent Company Filter */}
                            <div className="flex flex-col space-y-1 sm:space-y-2 flex-1 min-w-[120px]">
                                <label className="text-xs sm:text-sm text-gray-300 font-medium">Parent Company</label>
                                <select
                                    value={selectedParent}
                                    onChange={handleParentChange}
                                    className={`cursor-pointer px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 ${theme.bg.card} border border-gray-600 rounded-lg sm:rounded-xl focus:outline-none ${theme.border.focus} transition-all duration-300 ${theme.text.primary} text-sm sm:text-base w-full`}
                                >
                                    <option value="">All Parents</option>
                                    {getUniqueParents().map(parent => (
                                        <option key={parent} value={parent}>
                                            {parent}
                                        </option>
                                    ))}
                                </select>
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

                {/* Results Counter */}
                <ResultsCounter displayedCount={displayedBrands.length} filteredCount={getFilteredBrandsCount()} type={"brands"} />
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
                                        animationDelay: `${(index % BRANDS_PER_PAGE) * 50}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <BrandCard
                                        brand={brand}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <LoadMoreButton onClick={loadMoreBrands} disabled={loadingMore} message={"Load More Brands"} />
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <BlurText
                            text="No brands found"
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
        </PageLayout>
    );
};

export default AllBrandsPage;
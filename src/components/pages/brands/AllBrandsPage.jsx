import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from "../../primary/Background.jsx";
import Header from "../../primary/Header.jsx";
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import BrandCard from "../../cards/BrandCard.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import SearchBar from "../../utils/SearchBar.jsx";
import LoadMoreButton from "../../utils/LoadMoreButton.jsx";
import ResultsCounter from "../../utils/ResultsCounter.jsx";

const AllBrandsPage = () => {
    const navigate = useNavigate();
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

    // Get unique countries and parents from brands data
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

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(brand =>
                brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply country filter
        if (selectedCountry) {
            filtered = filtered.filter(brand => brand.country === selectedCountry);
        }

        // Apply parent company filter
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

            // Apply all filters
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
                    <Header page={2} />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 py-8 pt-[160px]">
                        {/* Hero Section */}
                        <div className="space-y-8 mb-16">
                            <div className="space-y-6 text-center">
                                <BlurText
                                    text="Explore Brands"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-6xl text-white lg:text-7xl font-bold leading-tight"
                                />
                                <BlurText
                                    text="Discover fragrances from the world's most prestigious and emerging brands"
                                    delay={80}
                                    animateBy="words"
                                    direction="bottom"
                                    className="flex justify-center text-2xl text-gray-200 max-w-3xl mx-auto"
                                />
                            </div>

                            {/* Search Bar */}
                            <SearchBar size={2} onSubmit={handleSearch} value={searchQuery} onChange={handleSearchChange} message={"Search for brands..."} />

                            {/* Filters Section */}
                            <div className="max-w-2xl mx-auto">
                                <div className={`${theme.card.blur} border border-gray-700 rounded-2xl p-6`}>
                                    <div className="flex flex-wrap gap-4 items-center justify-center">
                                        {/* Country Filter */}
                                        <div className="flex flex-col space-y-2">
                                            <label className="text-sm text-gray-400 font-medium">Country</label>
                                            <select
                                                value={selectedCountry}
                                                onChange={handleCountryChange}
                                                className={`cursor-pointer px-6 py-3 ${theme.bg.card} border border-gray-600 rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 ${theme.text.primary} min-w-[150px]`}
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
                                        <div className="flex flex-col space-y-2">
                                            <label className="text-sm text-gray-400 font-medium">Parent Company</label>
                                            <select
                                                value={selectedParent}
                                                onChange={handleParentChange}
                                                className={`cursor-pointer px-6 py-3 ${theme.bg.card} border border-gray-600 rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 ${theme.text.primary} min-w-[150px]`}
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
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-sm text-transparent font-medium">Clear</label>
                                                <button
                                                    onClick={clearFilters}
                                                    className="cursor-pointer px-5 py-3 bg-red-700 hover:bg-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium"
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
                        <div className="space-y-8">
                            {displayedBrands.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                                                    image={brand.image}
                                                    brand={brand.name}
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
                                <div className="text-center py-16">
                                    <BlurText
                                        text="No brands found"
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

                        {/* Call to Action */}
                        <div className="text-center space-y-6 pt-16">
                            <BlurText
                                text="Can't Find Your Favorite Brand?"
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
                                    Browse All Fragrances
                                </button>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Suggest a Brand
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

export default AllBrandsPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from "../primary/Background.jsx";
import Header from "../primary/Header.jsx";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText.jsx";
import RandomFragranceButton from "../utils/RandomFragranceButton.jsx";
import BrandCard from "../cards/BrandCard.jsx";
import FragranceCard from "../cards/FragranceCard.jsx";

const HomePage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredFragrances, setFeaturedFragrances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch 3 random fragrances from the API
        const fetchFeaturedContent = async () => {
            try {
                setLoading(true);

                // Make 3 separate API calls to get random fragrances
                const promises = Array.from({ length: 3 }, () =>
                    fetch('http://localhost:8080/random').then(response => response.json())
                );

                const fragrances = await Promise.all(promises);

                setFeaturedFragrances(fragrances);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching featured content:', error);
                setLoading(false);
            }
        };

        fetchFeaturedContent();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results page
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-800"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background />
            <div className="relative z-10 font-['Viaoda_Libre',serif] text-2xl">
                <div className="text-white">
                    {/* Header */}
                    <Header page={0} />

                    {/* Main Content */}
                    <main className="max-w-6xl mx-auto px-4 py-8 pt-[160px]">
                        {/* Hero Section */}
                        <div className=" space-y-8 mb-16">
                            <div className="space-y-6">
                                <BlurText
                                    text="Get Addicted"
                                    delay={100}
                                    animateBy="words"
                                    direction="top"
                                    className="flex justify-center text-6xl lg:text-7xl font-bold leading-tight"
                                />
                                <BlurText
                                    text="Explore thousands of fragrances from the world's most prestigious brands"
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
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for fragrances, brands, or notes..."
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

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-6 justify-center pt-8">
                                <button
                                    onClick={() => navigate('/fragrances')}
                                    className="cursor-pointer group relative inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-blue-400/30"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center space-x-3">
                                        <span className="text-2xl">🌺</span>
                                        <span>Browse All</span>
                                    </div>
                                </button>
                                <RandomFragranceButton text={"Random Discovery"} className={"cursor-pointer group relative inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-gray-500/30"}/>
                            </div>
                        </div>

                        {/* Featured Fragrances */}
                        <div className="space-y-8 mb-16">
                            <BlurText
                                text="Featured Fragrances"
                                delay={200}
                                animateBy="words"
                                direction="left"
                                className="flex justify-center text-4xl font-bold text-center text-blue-400"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredFragrances.map((fragrance) => (
                                    <FragranceCard fragrance={fragrance} key={fragrance.id} />
                                ))}
                            </div>
                        </div>

                        {/* Popular Brands */}
                        <div className="space-y-8">
                            <BlurText
                                text="Popular Brands"
                                delay={250}
                                animateBy="words"
                                direction="right"
                                className="flex justify-center text-4xl font-bold text-center text-blue-400"
                            />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <BrandCard image={"https://images.seeklogo.com/logo-png/41/1/christian-dior-logo-png_seeklogo-410283.png"} brand={"dior"}/>
                                <BrandCard image={"https://images.seeklogo.com/logo-png/28/1/yves-saint-laurent-logo-png_seeklogo-288938.png"} brand={"yves-saint-laurent"}/>
                                <BrandCard image={"https://images.seeklogo.com/logo-png/7/1/jean-paul-gaultier-logo-png_seeklogo-75250.png"} brand={"jean-paul-gaultier"}/>
                                <BrandCard image={"https://images.seeklogo.com/logo-png/29/1/parfums-de-marly-logo-png_seeklogo-297710.png"} brand={"parfums-de-marly"}/>
                                <BrandCard image={"https://fimgs.net/mdimg/dizajneri/o.2260.jpg"} brand={"initio-parfums-prives"}/>
                                <BrandCard image={"https://fimgs.net/mdimg/dizajneri/o.50.jpg"} brand={"creed"}/>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="text-center space-y-6 pt-16">
                            <BlurText
                                text="Ready to Start Your Fragrance Journey?"
                                delay={300}
                                animateBy="words"
                                direction="bottom"
                                className="flex justify-center text-3xl font-bold text-white"
                            />
                            <div className="flex gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/collection')}
                                    className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Build Your Collection
                                </button>
                                <button
                                    onClick={() => navigate('/wishlist')}
                                    className="border border-blue-800 text-blue-400 hover:bg-blue-800 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
                                >
                                    Create Wishlist
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
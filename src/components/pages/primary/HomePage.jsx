// HomePage.jsx - Responsive version
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import BlurText from "../../../blocks/TextAnimations/BlurText/BlurText.jsx";
import RandomFragranceButton from "../../utils/buttons/RandomFragranceButton.jsx";
import BrandCard from "../../cards/BrandCard.jsx";
import FragranceCard from "../../cards/FragranceCard.jsx";
import LoadingPage from "./LoadingPage.jsx";
import BrowseAllButton from "../../utils/buttons/BrowseAllButton.jsx";
import HeroSection from "../../utils/HeroSection.jsx";
import PageLayout from "../../primary/PageLayout.jsx";

const HomePage = () => {
    const { theme } = useTheme();
    const [featuredFragrances, setFeaturedFragrances] = useState([]);
    const [featuredBrands, setFeaturedBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        const fetchFeaturedFragrances = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/random-frag?count=4`);
                if (!response.ok) throw new Error('Failed to fetch fragrances');
                const fragrances = await response.json();
                setFeaturedFragrances(fragrances);
            } catch (error) {
                console.error('Error fetching fragrances:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedFragrances();
    }, []);

    useEffect(() => {
        const fetchFeaturedBrands = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/random-brand?count=4`);
                if (!response.ok) throw new Error('Failed to fetch brands');
                const brands = await response.json();
                setFeaturedBrands(brands);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedBrands();
    }, []);


    const BRANDS_PER_PAGE = 4;
    const FRAGRANCES_PER_PAGE = 4;

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <PageLayout headerNum={0} style={<style jsx>{`
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
            `}</style>}>
            {/* Hero Section */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <HeroSection primaryText={"Get Addicted"} secondaryText={"Explore thousands of fragrances from the world's most prestigious brands"}/>

                {/* Quick Actions */}
                <div className="flex flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center pt-4 sm:pt-6 md:pt-8 px-2">
                    <BrowseAllButton/>
                    <RandomFragranceButton
                        text={"Random Discovery"}
                        className={`text-shadow-md cursor-pointer group relative inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-lg md:text-xl font-bold ${theme.text.primary} bg-gradient-to-r ${theme.randomDiscoveryButton.primary} rounded-lg sm:rounded-xl shadow-lg hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-gray-500/30`}
                    />
                </div>
            </div>

            {/* Featured Fragrances */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <BlurText
                    text="Featured Fragrances"
                    delay={200}
                    animateBy="words"
                    direction="left"
                    className={`text-shadow-lg flex justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white px-2`}
                />

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                    {featuredFragrances.map((fragrance, index) => (
                        <div
                            key={fragrance.id || fragrance.name || index}
                            className="animate-fadeIn"
                            style={{
                                animationDelay: `${(index % FRAGRANCES_PER_PAGE) * 50}ms`,
                                animationFillMode: 'both'
                            }}
                        >
                            <FragranceCard fragrance={fragrance} key={fragrance.id} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Brands */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <BlurText
                    text="Featured Brands"
                    delay={250}
                    animateBy="words"
                    direction="right"
                    className={`text-shadow-lg flex justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white px-2`}
                />
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {featuredBrands.map((brand, index) => (
                        <div
                            key={brand.id || brand.name || index}
                            className="animate-fadeIn"
                            style={{
                                animationDelay: `${(index % BRANDS_PER_PAGE) * 50}ms`,
                                animationFillMode: 'both'
                            }}
                        >
                            <BrandCard brand={brand}/>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default HomePage;
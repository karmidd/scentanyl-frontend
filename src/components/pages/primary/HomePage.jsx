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
import PageLayout from "../../utils/PageLayout.jsx";

const HomePage = () => {
    const { theme } = useTheme();
    const [featuredFragrances, setFeaturedFragrances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch 4 random fragrances from the API
        const fetchFeaturedContent = async () => {
            try {
                setLoading(true);

                // Make 4 separate API calls to get random fragrances
                const promises = Array.from({ length: 4 }, () =>
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


    if (loading) {
        return (
            <LoadingPage />
        );
    }

    return (
        <PageLayout headerNum={0}>
            {/* Hero Section */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12 md:mb-16">
                <HeroSection primaryText={"Get Addicted"} secondaryText={"Explore thousands of fragrances from the world's most prestigious brands"}/>

                {/* Quick Actions */}
                <div className="flex flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center pt-4 sm:pt-6 md:pt-8 px-2">
                    <BrowseAllButton/>
                    <RandomFragranceButton
                        text={"Random Discovery"}
                        className={`cursor-pointer group relative inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-lg md:text-xl font-bold ${theme.text.primary} bg-gradient-to-r ${theme.randomDiscoveryButton.primary} rounded-lg sm:rounded-xl shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-gray-500/30`}
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
                    className={`flex justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white px-2`}
                />

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                    {featuredFragrances.map((fragrance) => (
                        <FragranceCard fragrance={fragrance} key={fragrance.id} />
                    ))}
                </div>
            </div>

            {/* Popular Brands */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <BlurText
                    text="Popular Brands"
                    delay={250}
                    animateBy="words"
                    direction="right"
                    className={`flex justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white px-2`}
                />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                    <BrandCard image={"https://images.seeklogo.com/logo-png/41/1/christian-dior-logo-png_seeklogo-410283.png"} brand={"dior"}/>
                    <BrandCard image={"https://images.seeklogo.com/logo-png/28/1/yves-saint-laurent-logo-png_seeklogo-288938.png"} brand={"yves-saint-laurent"}/>
                    <BrandCard image={"https://images.seeklogo.com/logo-png/7/1/jean-paul-gaultier-logo-png_seeklogo-75250.png"} brand={"jean-paul-gaultier"}/>
                    <BrandCard image={"https://images.seeklogo.com/logo-png/29/1/parfums-de-marly-logo-png_seeklogo-297710.png"} brand={"parfums-de-marly"}/>
                    <BrandCard image={"https://fimgs.net/mdimg/dizajneri/o.2260.jpg"} brand={"initio-parfums-prives"}/>
                    <BrandCard image={"https://fimgs.net/mdimg/dizajneri/o.50.jpg"} brand={"creed"}/>
                </div>
            </div>
        </PageLayout>
    );
};

export default HomePage;
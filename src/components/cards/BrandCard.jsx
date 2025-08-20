import React from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function BrandCard({brand}){
    const navigate = useNavigate();
    const { theme } = useTheme();
    const handleBrandClick = (e, brand) => {
        const url = `/brands/${encodeURIComponent(brand)}`;

        if (e.button === 1) return;

        if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            window.open(url, '_blank');
        } else if (e.button === 0) {
            e.preventDefault();
            navigate(url);
        }
    };
    return (
        <div
            className={`shadow-lg cursor-pointer ${theme.card.primary} ${theme.text.primary} border border-gray-700 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 ${theme.border.hover} transition-all duration-300 hover:shadow-lg ${theme.shadow.button} hover:scale-105 transform group relative overflow-hidden`}
        >
            <a
                href={`/brands/${brand.name}`}
                onMouseDown={(e) => handleBrandClick(e, brand.name)}
                className="block h-full no-underline text-inherit"
            >
            {/* Background gradient effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col">
                {/* Brand Name - Always at top, centered */}
                <div className="text-center mb-2 sm:mb-3">
                    <h3 className={`text-shadow-sm text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold ${theme.text.groupHover} transition-colors duration-300 capitalize leading-tight`}>
                        {brand.name}
                    </h3>
                </div>

                {/* Count Section - Between name and country */}
                {brand.totalFragrances !== undefined && brand.totalFragrances !== null && (
                    <div className="text-center mb-2 sm:mb-3">
                        <div className={`shadow-sm inline-flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 rounded-full ${theme.card.primary} border border-gray-600/30 ${theme.border.groupHover} duration-300`}>
                            <span className={`text-sm text-shadow-xs sm:text-base md:text-lg font-semibold ${theme.text.primary} ${theme.text.groupHover} transition-colors duration-300`}>
                                {brand.totalFragrances}
                            </span>
                            <span className={`ml-2 text-xs text-shadow-2xs sm:text-sm ${theme.text.secondary} ${theme.text.groupHover} transition-colors duration-300`}>
                                {brand.totalFragrances === 1 ? 'fragrance' : 'fragrances'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Country Section - Only if country exists */}
                {brand.country && (
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                        <svg
                            className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${theme.text.secondary} ${theme.text.groupHover} transition-colors duration-300`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <h2 className={`text-shadow-xs text-xs sm:text-sm md:text-base lg:text-lg font-medium ${theme.text.secondary} ${theme.text.groupHover} transition-colors duration-300 capitalize`}>
                            {brand.country}
                        </h2>
                    </div>
                )}

                {/* Call to Action - Always at bottom */}
                <div className="border-t border-gray-600/30 pt-2 sm:pt-3 transition-colors duration-300 mt-auto">
                    <div className={`text-center ${theme.text.secondary} text-[10px] sm:text-xs md:text-sm ${theme.text.groupHover} transition-all duration-300`}>
                        <span className="text-shadow-xs inline-flex items-center space-x-1">
                            <span>Click to explore fragrances</span>
                            <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            </a>
        </div>
    );
}
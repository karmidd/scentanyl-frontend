import React from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function FragranceCard({fragrance}) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const handleFragranceClick = (fragrance, e) => {
        const url = `/fragrances/${encodeURIComponent(fragrance.brand)}/${encodeURIComponent(fragrance.name)}/${fragrance.id}`;

        // Ctrl/Cmd + Click
        if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            window.open(url, '_blank');
        }

        // Normal left click
        else if (e.button === 0) {
            e.preventDefault();
            navigate(url);
        }
    };
    return (
        <div
            key={fragrance.id}
            className={`${theme.card.primary} shadow-lg p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl border border-gray-700 ${theme.border.hover} ${theme.shadow.button} transition-all duration-300 hover:scale-105 cursor-pointer group`}
        >
            <a
                href={`/fragrances/${encodeURIComponent(fragrance.brand)}/${encodeURIComponent(fragrance.name)}/${fragrance.id}`}
                onMouseDown={(e) => handleFragranceClick(fragrance, e)}
                className="block h-full no-underline text-inherit"
            >
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                    <span className={`shadow-md text-shadow-md px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 ${fragrance.gender === "men" ? "bg-blue-800" : fragrance.gender === "women" ? "bg-pink-600" : "bg-gradient-to-r from-pink-600 via-purple-500 to-blue-800"} rounded-full text-[10px] sm:text-xs md:text-sm font-medium text-white`}>
                        {fragrance.gender}
                    </span>
                    <span className={`${theme.text.secondary} ${theme.text.groupHover} duration-300 text-shadow-sm font-bold text-xs sm:text-sm md:text-lg`}>{fragrance.year}</span>
                </div>
                <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5 lg:space-y-2 flex-grow">
                    <h3 className={`text-shadow-sm text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold ${theme.text.groupHover} duration-300 transition-colors`}>
                        {fragrance.name}
                    </h3>
                    <p className={`${theme.text.secondary} ${theme.text.groupHover} text-shadow-sm duration-300 text-xs sm:text-sm md:text-base lg:text-lg`}>
                        by {fragrance.brand}
                    </p>
                </div>
                <div className="flex items-center justify-between pt-1 sm:pt-1.5 md:pt-2 lg:pt-3 xl:pt-4">
                    <span className={`${theme.text.secondary} ${theme.text.groupHover} duration-300 text-shadow-sm text-[10px] sm:text-xs md:text-sm`}>Click to explore</span>
                    <svg className={`${theme.text.groupHover} ${theme.text.secondary} w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-400 transform group-hover:translate-x-2 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
            </a>
        </div>
    );
}
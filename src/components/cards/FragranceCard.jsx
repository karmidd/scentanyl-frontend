import React from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function FragranceCard({fragrance}) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const handleFragranceClick = (fragrance) => {
        navigate(`/fragrances/${fragrance.brand}/${fragrance.name}`);
    };
    return (
        <div
            key={fragrance.id}
            onClick={() => handleFragranceClick(fragrance)}
            className={`${theme.card.primary} p-6 rounded-xl border ${theme.border.primary} ${theme.border.hover} transition-all duration-300 hover:scale-105 cursor-pointer group`}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 ${fragrance.gender === "men" ? "bg-blue-800" : fragrance.gender === "women" ? "bg-pink-600" : "bg-gradient-to-r from-pink-600 via-purple-500 to-blue-800"} rounded-full text-sm font-medium text-white`}>
                        {fragrance.gender}
                    </span>
                    <span className="text-2xl">✨</span>
                </div>
                <div className="space-y-2">
                    <h3 className={`text-2xl font-bold ${theme.text.hover} transition-colors`}>
                        {fragrance.name}
                    </h3>
                    <p className={`${theme.text.secondary} text-lg`}>
                        by {fragrance.brand}
                    </p>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <span className={`${theme.text.accent} text-sm`}>Tap to explore</span>
                    <svg className="w-5 h-5 text-blue-400 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="gray" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
import React from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../contexts/ThemeContext.jsx";

export default function BrowseAllButton() {
    const navigate = useNavigate();
    const {theme} = useTheme();
    return (
        <button
            onClick={() => navigate('/fragrances')}
            className={`cursor-pointer group relative inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-lg md:text-xl font-bold text-white ${theme.button.browseAll} rounded-lg sm:rounded-xl shadow-2xl ${theme.shadow.button} transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-blue-400/30`}
        >
            <div className={`absolute inset-0 ${theme.button.browseAll} rounded-lg sm:rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
            <div className="relative flex items-center space-x-2 sm:space-x-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Browse All</span>
            </div>
        </button>
    );
}
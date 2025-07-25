import React from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function BrowseAllButton() {
    const navigate = useNavigate();
    const {theme} = useTheme();
    return (
        <button
            onClick={() => navigate('/fragrances')}
            className={`cursor-pointer group relative inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white ${theme.button.browseAll} rounded-xl shadow-2xl ${theme.shadow.button} transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-blue-400/30`}
        >
            <div className={`absolute inset-0 ${theme.button.browseAll} rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
            <div className="relative flex items-center space-x-3">
                <span className="text-2xl">🌺</span>
                <span>Browse All</span>
            </div>
        </button>
    );
}
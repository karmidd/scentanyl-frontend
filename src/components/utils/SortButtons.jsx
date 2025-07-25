import React from "react";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function SortButtons({ handleSortChange, sortBy }) {
    const { theme } = useTheme();
    return (
        <div className="flex justify-center space-x-4">
            <button
                onClick={() => handleSortChange('alphabetical')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-lg ${
                    sortBy === 'alphabetical'
                        ? theme.card.selected
                        : theme.card.primary
                }`}
            >
                Alphabetical
            </button>
            <button
                onClick={() => handleSortChange('popularity')}
                className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-600 hover:scale-105 text-lg ${
                    sortBy === 'popularity'
                        ? theme.card.selected
                        : theme.card.primary
                }`}
            >
                Most Popular
            </button>
        </div>
    );
}
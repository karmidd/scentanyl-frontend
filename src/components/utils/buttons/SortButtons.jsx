import React from "react";
import {useTheme} from "../../contexts/ThemeContext.jsx";

export default function SortButtons({ handleSortChange, sortBy }) {
    const { theme } = useTheme();
    return (
        <div className="flex justify-center space-x-2 sm:space-x-3 md:space-x-4 flex-wrap gap-y-2">
            <button
                onClick={() => handleSortChange('alphabetical')}
                className={`shadow-lg text-shadow-xs cursor-pointer px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base md:text-lg ${
                    sortBy === 'alphabetical'
                        ? theme.card.selected
                        : theme.card.primary
                }`}
            >
                Alphabetical
            </button>
            <button
                onClick={() => handleSortChange('fragranceCount')}
                className={`shadow-lg text-shadow-xs cursor-pointer px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-600 hover:scale-105 text-sm sm:text-base md:text-lg ${
                    sortBy === 'fragranceCount'
                        ? theme.card.selected
                        : theme.card.primary
                }`}
            >
                Most Fragrances
            </button>
        </div>
    );
}
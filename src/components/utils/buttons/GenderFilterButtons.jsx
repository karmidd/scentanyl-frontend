import React from "react";
import {useTheme} from "../../contexts/ThemeContext.jsx";

export default function GenderFilterButtons({ onClick, selectedGender }) {
    const { theme } = useTheme();
    return (
        <div className="flex justify-center space-x-2 sm:space-x-3 md:space-x-4 flex-wrap gap-y-2">
            {['all', 'men', 'women', 'unisex'].map((gender) => (
                <button
                    key={gender}
                    onClick={() => onClick(gender)}
                    className={`px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base md:text-lg cursor-pointer ${
                        selectedGender === gender
                            ? theme.card.selected
                            : theme.card.primary
                    }`}
                >
                    {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
            ))}
        </div>
    );
}
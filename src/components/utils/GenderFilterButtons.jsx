import React from "react";
import {useTheme} from "../contexts/ThemeContext.jsx";

export default function GenderFilterButtons({ onClick, selectedGender }) {
    const { theme } = useTheme();
    return (
        <div className="flex justify-center space-x-4">
            {['all', 'men', 'women', 'unisex'].map((gender) => (
                <button
                    key={gender}
                    onClick={() => onClick(gender)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-lg cursor-pointer ${
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
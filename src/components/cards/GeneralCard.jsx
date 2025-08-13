import React from 'react';
import {useTheme} from "../contexts/ThemeContext.jsx";

const GeneralCard = ({ name, total, message, onClick }) => {
    const { theme } = useTheme();
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer ${theme.card.primary} ${theme.text.primary} border border-gray-700 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 ${theme.border.hover} transition-all duration-300 hover:shadow-lg ${theme.shadow.button} hover:scale-105 transform group h-full`}
        >
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-4 flex flex-col h-full">
                {/* Item Name */}
                <h3 className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold ${theme.text.groupHover} transition-colors duration-300 capitalize line-clamp-2`}>
                    {name}
                </h3>

                {/* Total */}
                <div className="flex items-center justify-between flex-grow">
                    <div className={`${theme.text.secondary} text-xs sm:text-sm md:text-base lg:text-xl`}>
                        Total
                    </div>
                    <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${theme.text.other_accent}`}>
                        {total}
                    </div>
                </div>

                {/* Visual Indicator */}
                <div className="w-full bg-gray-800 rounded-full h-1 sm:h-1.5 md:h-2">
                    <div
                        className={`${theme.card.indicator} h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}
                    ></div>
                </div>

                {/* Hover Effect Text */}
                <div className={`text-center ${theme.text.secondary} text-[10px] sm:text-xs md:text-sm ${theme.text.groupHover} transition-colors duration-300 line-clamp-2`}>
                    {message}
                </div>
            </div>
        </div>
    );
};

export default GeneralCard;
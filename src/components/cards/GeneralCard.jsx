import React from 'react';
import {useTheme} from "../contexts/ThemeContext.jsx";

const GeneralCard = ({ name, total, message, onClick }) => {
    const { theme } = useTheme();
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer ${theme.card.primary} ${theme.text.primary} border border-gray-700 rounded-2xl p-6 ${theme.border.hover} transition-all duration-300 hover:shadow-lg ${theme.shadow.button} hover:scale-105 transform group`}
        >
            <div className="space-y-4">
                {/* Item Name */}
                <h3 className={`text-2xl font-bold ${theme.text.hover} transition-colors duration-300 capitalize`}>
                    {name}
                </h3>

                {/* Total Fragrances */}
                <div className="flex items-center justify-between">
                    <div className={theme.text.secondary}>
                        Total Fragrances
                    </div>
                    <div className={`text-3xl font-bold ${theme.text.other_accent}`}>
                        {total}
                    </div>
                </div>

                {/* Visual Indicator */}
                <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                        className={`${theme.card.indicator} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}
                    ></div>
                </div>

                {/* Hover Effect Text */}
                <div className={`text-center ${theme.text.secondary} text-sm ${theme.text.hover} transition-colors duration-300`}>
                    {message}
                </div>
            </div>
        </div>
    );
};

export default GeneralCard;
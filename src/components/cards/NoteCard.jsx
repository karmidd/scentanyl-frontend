import React from "react";
import {useTheme} from "../contexts/ThemeContext.jsx";

const NoteCard = ({ note, noteData, onClick }) => {
    const { total, topNotes, middleNotes, baseNotes, uncategorizedNotes } = noteData;
    const { theme } = useTheme();
    return (
        <div
            onClick={onClick}
            className={`group relative ${theme.text.primary} ${theme.card.primary} border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 ${theme.border.hover} transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20`}
        >
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className={`text-base sm:text-lg md:text-xl font-bold ${theme.text.hover} transition-colors duration-300 capitalize`}>
                        {note}
                    </h3>
                    <div className={`${theme.card.selected} text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold`}>
                        {total}
                    </div>
                </div>

                <div className={`space-y-1 sm:space-y-2 ${theme.text.secondary} font-bold text-xs sm:text-sm`}>
                    <div className="flex justify-between">
                        <span>As a Top Note:</span>
                        <span>{topNotes}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>As a Middle Note:</span>
                        <span>{middleNotes}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>As a Base Note:</span>
                        <span>{baseNotes}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>As an Uncategorized Note:</span>
                        <span>{uncategorizedNotes}</span>
                    </div>
                </div>

                <div className="pt-1 sm:pt-2 border-t border-gray-700">
                    <div className={`text-center ${theme.text.secondary} text-xs sm:text-sm ${theme.text.hover} transition-colors duration-300`}>
                        Click to explore fragrances with this note
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
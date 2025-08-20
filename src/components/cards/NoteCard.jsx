import React from "react";
import {useTheme} from "../contexts/ThemeContext.jsx";

const NoteCard = ({ note, noteData, onClick, href  }) => {
    const { totalFragrances, topNotes, middleNotes, baseNotes, uncategorizedNotes } = noteData;
    const { theme } = useTheme();
    const handleClick = (e) => {
        if (e.button === 1) return;

        if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (href) window.open(href, '_blank');
        } else if (e.button === 0) {
            e.preventDefault();
            if (onClick) onClick();
        }
    };
    return (
        <div
            className={`shadow-lg group relative ${theme.text.primary} ${theme.card.primary} border border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 ${theme.border.hover} transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20`}
        >
            <a
                href={href || '#'}
                onMouseDown={handleClick}
                className="block no-underline text-inherit"
                onClick={(e) => e.preventDefault()}
            >
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-4 flex flex-col">
                <div className="flex items-center justify-between">
                    <h3 className={`text-shadow-sm text-sm sm:text-base md:text-lg lg:text-xl font-bold ${theme.text.groupHover} transition-colors duration-300 capitalize`}>
                        {note}
                    </h3>
                    <div className={`${theme.card.selected} text-shadow-sm text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold`}>
                        {totalFragrances}
                    </div>
                </div>

                <div className={`text-shadow-xs space-y-0.5 sm:space-y-1 md:space-y-1.5 lg:space-y-2 ${theme.text.secondary} ${theme.text.groupHover} duration-300 font-bold text-[10px] sm:text-xs md:text-sm flex-grow`}>
                    <div className="flex justify-between">
                        <span className="truncate pr-1">As a Top Note:</span>
                        <span>{topNotes}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="truncate pr-1">As a Middle Note:</span>
                        <span>{middleNotes}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="truncate pr-1">As a Base Note:</span>
                        <span>{baseNotes}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="truncate pr-1">As an Uncategorized Note:</span>
                        <span>{uncategorizedNotes}</span>
                    </div>
                </div>

                <div className="pt-1 sm:pt-1.5 md:pt-2 border-t border-gray-600/30">
                    <div className={`text-center text-shadow-xs ${theme.text.secondary} text-[9px] sm:text-[10px] md:text-xs lg:text-sm ${theme.text.groupHover} transition-colors duration-300`}>
                        Click to explore fragrances with this note
                    </div>
                </div>
            </div>
            </a>
        </div>
    );
};

export default NoteCard;
import React from "react";

const NoteCard = ({ note, noteData, onClick }) => {
    const { total, topNotes, middleNotes, baseNotes, uncategorizedNotes } = noteData;

    return (
        <div
            onClick={onClick}
            className="group relative bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 capitalize">
                        {note}
                    </h3>
                    <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {total}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">As a Top Note:</span>
                        <span className="text-gray-300">{topNotes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">As a Middle Note:</span>
                        <span className="text-gray-300">{middleNotes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">As a Base Note:</span>
                        <span className="text-gray-300">{baseNotes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">As an Uncategorized Note:</span>
                        <span className="text-gray-300">{uncategorizedNotes}</span>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-700">
                    <div className="text-center text-gray-400 text-sm">
                        Click to explore fragrances with this note
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
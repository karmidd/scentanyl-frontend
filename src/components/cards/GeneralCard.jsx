import React from 'react';

const GeneralCard = ({ name, total, message, onClick }) => {

    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 transform group"
        >
            <div className="space-y-4">
                {/* Item Name */}
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 capitalize">
                    {name}
                </h3>

                {/* Total Fragrances */}
                <div className="flex items-center justify-between">
                    <div className="text-gray-400">
                        Total Fragrances
                    </div>
                    <div className="text-3xl font-bold text-blue-400">
                        {total}
                    </div>
                </div>

                {/* Visual Indicator */}
                <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (total / 100) * 100)}%` }}
                    ></div>
                </div>

                {/* Hover Effect Text */}
                <div className="text-sm text-gray-500 group-hover:text-blue-300 transition-colors duration-300">
                    {message}
                </div>
            </div>
        </div>
    );
};

export default GeneralCard;
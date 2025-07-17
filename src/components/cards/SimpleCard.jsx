import React from "react";

const SimpleCard = ({ info, onClick, message }) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
        >
            <div className="space-y-4">
                <div className="flex items-center justify-center text-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 capitalize">
                        {info}
                    </h3>
                </div>

                <div className="pt-2 border-t border-gray-700">
                    <div className="text-center text-gray-400 text-sm">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleCard;
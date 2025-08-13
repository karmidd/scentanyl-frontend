import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const YearFilterButton = ({
                              onYearRangeChange,
                              onSortChange,
                              minYear = 1533,
                              maxYear = new Date().getFullYear(),
                              initialRange = null
                          }) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [yearRange, setYearRange] = useState(initialRange || [minYear, maxYear]);
    const [isEditingMin, setIsEditingMin] = useState(false);
    const [isEditingMax, setIsEditingMax] = useState(false);
    const [sortOrder, setSortOrder] = useState('none'); // 'none', 'newest', 'oldest'
    const [isDragging, setIsDragging] = useState(null); // null, 'min', 'max'
    const [tempMinYear, setTempMinYear] = useState('');
    const [tempMaxYear, setTempMaxYear] = useState('');
    const isDefaultState = yearRange[0] === minYear && yearRange[1] === maxYear && sortOrder === 'none';

    // Calculate position percentage for slider handles
    const getPositionPercent = (year) => {
        return ((year - minYear) / (maxYear - minYear)) * 100;
    };

    // Convert position percentage back to year
    const getYearFromPercent = (percent) => {
        return Math.round(minYear + (percent / 100) * (maxYear - minYear));
    };

    // Handle slider drag
    const handleMouseDown = (handle) => (e) => {
        e.preventDefault();
        setIsDragging(handle);
    };

    const handleMinYearEdit = () => {
        setIsEditingMin(true);
        setTempMinYear(yearRange[0].toString());
    };

    const handleMaxYearEdit = () => {
        setIsEditingMax(true);
        setTempMaxYear(yearRange[1].toString());
    };

    const handleMinYearSubmit = () => {
        const year = parseInt(tempMinYear);
        if (!isNaN(year) && year >= minYear && year <= yearRange[1]) {
            const newRange = [year, yearRange[1]];
            setYearRange(newRange);
            const isDefault = year === minYear && yearRange[1] === maxYear && sortOrder === 'none';
            onYearRangeChange(isDefault ? null : newRange);
        }
        setIsEditingMin(false);
    };

    const handleMaxYearSubmit = () => {
        const year = parseInt(tempMaxYear);
        if (!isNaN(year) && year <= maxYear && year >= yearRange[0]) {
            const newRange = [yearRange[0], year];
            setYearRange(newRange);
            const isDefault = yearRange[0] === minYear && year === maxYear && sortOrder === 'none';
            onYearRangeChange(isDefault ? null : newRange);
        }
        setIsEditingMax(false);
    };

    const handleKeyPress = (e, submitFunc) => {
        if (e.key === 'Enter') {
            submitFunc();
        } else if (e.key === 'Escape') {
            setIsEditingMin(false);
            setIsEditingMax(false);
        }
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        const slider = document.getElementById('year-slider-track');
        if (!slider) return;

        const rect = slider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const year = getYearFromPercent(percent);

        setYearRange(prev => {
            if (isDragging === 'min') {
                return [Math.min(year, prev[1]), prev[1]];
            } else if (isDragging === 'max') {
                return [prev[0], Math.max(year, prev[0])];
            }
            return prev;
        });
    }, [isDragging, minYear, maxYear]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(null);
            // Check if we're back to default state
            const isDefault = yearRange[0] === minYear && yearRange[1] === maxYear && sortOrder === 'none';
            onYearRangeChange(isDefault ? null : yearRange);
        }
    }, [isDragging, yearRange, onYearRangeChange, minYear, maxYear, sortOrder]);

    // Handle touch events for mobile
    const handleTouchStart = (handle) => (e) => {
        e.preventDefault();
        setIsDragging(handle);
    };

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;

        const slider = document.getElementById('year-slider-track');
        if (!slider) return;

        const touch = e.touches[0];
        const rect = slider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
        const year = getYearFromPercent(percent);

        setYearRange(prev => {
            if (isDragging === 'min') {
                return [Math.min(year, prev[1]), prev[1]];
            } else if (isDragging === 'max') {
                return [prev[0], Math.max(year, prev[0])];
            }
            return prev;
        });
    }, [isDragging, minYear, maxYear]);

    // Add event listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

    // Handle sort button clicks
    const handleSortClick = (order) => {
        const newOrder = sortOrder === order ? 'none' : order;
        setSortOrder(newOrder);
        onSortChange(newOrder);

        // If we have a sort but no custom range, set the range to indicate filtering is active
        if (newOrder !== 'none' && yearRange[0] === minYear && yearRange[1] === maxYear) {
            onYearRangeChange(yearRange); // Pass the current range to activate filtering
        } else if (newOrder === 'none' && yearRange[0] === minYear && yearRange[1] === maxYear) {
            onYearRangeChange(null); // Back to default state
        }
    };

    // Reset filter
    const handleReset = () => {
        setYearRange([minYear, maxYear]);
        setSortOrder('none');
        onYearRangeChange(null);
        onSortChange('none');
    };

    const isFiltered = yearRange[0] !== minYear || yearRange[1] !== maxYear || sortOrder !== 'none';

    return (
        <div className="relative">
            {/* Main Filter Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`shadow-md text-shadow-xs cursor-pointer px-4 sm:px-5 md:px-6 py-3 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-sm md:text-base lg:text-lg cursor-pointer ${
                    isFiltered
                        ? 'bg-yellow-500 text-white shadow-lg'
                        : theme.card.primary
                }`}
            >
                Year Filter
                {isFiltered && (
                    <span className="ml-2 text-xs sm:text-sm">
                        ({yearRange[0]} - {yearRange[1]})
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 ${theme.card.primary} rounded-xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-700 z-50 w-[280px] sm:w-[320px] md:w-[380px]`}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-shadow-xs font-semibold text-sm sm:text-base md:text-lg ${theme.text.primary}`}>
                            Filter by Year
                        </h3>
                        {isFiltered && (
                            <button
                                onClick={handleReset}
                                className="shadow-lg text-shadow-xs cursor-pointer px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm rounded-lg transition-all duration-200 hover:scale-105 font-medium"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Year Range Display with Editable Inputs */}
                    <div className="flex justify-between items-center mb-8">
                        {/* Min Year */}
                        <div className="flex-1 text-center">
                            {isEditingMin ? (
                                <input
                                    type="number"
                                    value={tempMinYear}
                                    onChange={(e) => setTempMinYear(e.target.value)}
                                    onBlur={handleMinYearSubmit}
                                    onKeyDown={(e) => handleKeyPress(e, handleMinYearSubmit)}
                                    className={`w-20 px-2 py-1 ${theme.card.primary} rounded text-center text-sm sm:text-base`}
                                    min={minYear}
                                    max={yearRange[1]}
                                    autoFocus
                                />
                            ) : (
                                <button
                                    onClick={handleMinYearEdit}
                                    className={`text-shadow-xs shadow-md cursor-pointer px-3 py-1 rounded ${theme.card.secondary} ${theme.card.hover} transition-colors text-sm sm:text-base ${theme.text.primary}`}
                                >
                                    {yearRange[0]}
                                </button>
                            )}
                        </div>

                        {/* Range Info */}
                        <div className={`text-shadow-2xs flex-1 text-center font-semibold text-sm sm:text-base ${theme.text.other_accent}`}>
                            {yearRange[0] === yearRange[1]
                                ? `${yearRange[0]}`
                                : `${yearRange[1] - yearRange[0] + 1} years`}
                        </div>

                        {/* Max Year */}
                        <div className="flex-1 text-center">
                            {isEditingMax ? (
                                <input
                                    type="number"
                                    value={tempMaxYear}
                                    onChange={(e) => setTempMaxYear(e.target.value)}
                                    onBlur={handleMaxYearSubmit}
                                    onKeyDown={(e) => handleKeyPress(e, handleMaxYearSubmit)}
                                    className={`w-20 px-2 py-1 ${theme.card.primary} rounded text-center text-sm sm:text-base`}
                                    min={yearRange[0]}
                                    max={maxYear}
                                    autoFocus
                                />
                            ) : (
                                <button
                                    onClick={handleMaxYearEdit}
                                    className={`text-shadow-xs shadow-md cursor-pointer px-3 py-1 rounded ${theme.card.secondary} ${theme.card.hover} transition-colors text-sm sm:text-base ${theme.text.primary}`}
                                >
                                    {yearRange[1]}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Slider Container */}
                    <div className="relative h-6 mb-6">
                        <div
                            id="year-slider-track"
                            className="absolute transform -translate-y-1/2 w-full h-2 bg-gray-700 rounded-full"
                        >
                            {/* Active Range Bar */}
                            <div
                                className={`shadow-md absolute h-full ${theme.card.indicator} rounded-full`}
                                style={{
                                    left: `${getPositionPercent(yearRange[0])}%`,
                                    width: `${getPositionPercent(yearRange[1]) - getPositionPercent(yearRange[0])}%`
                                }}
                            />

                            {/* Min Handle */}
                            <div
                                className={`absolute transform translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md cursor-grab ${
                                    isDragging === 'min' ? 'cursor-grabbing scale-110' : 'hover:scale-105'
                                } transition-transform`}
                                style={{ left: `${getPositionPercent(yearRange[0])}%`, transform: 'translate(-50%, -50%)' }}
                                onMouseDown={handleMouseDown('min')}
                                onTouchStart={handleTouchStart('min')}
                            >
                                <div className={`absolute inset-1 ${theme.button.primary} rounded-full`} />
                            </div>

                            {/* Max Handle */}
                            <div
                                className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md cursor-grab ${
                                    isDragging === 'max' ? 'cursor-grabbing scale-110' : 'hover:scale-105'
                                } transition-transform`}
                                style={{ left: `${getPositionPercent(yearRange[1])}%`, transform: 'translate(-50%, -50%)' }}
                                onMouseDown={handleMouseDown('max')}
                                onTouchStart={handleTouchStart('max')}
                            >
                                <div className={`absolute inset-1 ${theme.button.primary} rounded-full`} />
                            </div>
                        </div>
                    </div>

                    {/* Sort Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={() => handleSortClick('newest')}
                            className={`transition-all duration-300 hover:scale-105 cursor-pointer flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                sortOrder === 'newest'
                                    ? theme.card.selected
                                    : theme.card.secondary  + ' shadow-lg'
                            }`}
                        >
                            ↓ Newest First
                        </button>
                        <button
                            onClick={() => handleSortClick('oldest')}
                            className={`transition-all duration-300 hover:scale-105 cursor-pointer flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                sortOrder === 'oldest'
                                    ? theme.card.selected
                                    : theme.card.secondary + ' shadow-lg'
                            }`}
                        >
                            ↑ Oldest First
                        </button>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className={`cursor-pointer ${theme.card.secondary} shadow-lg transition-all duration-300 hover:scale-105 rounded-lg mt-4 w-full py-2 text-xs sm:text-sm`}
                    >
                        Close
                    </button>
                </div>
            )}

            {/* Overlay to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default YearFilterButton;
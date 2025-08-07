import RandomFragranceButton from "./buttons/RandomFragranceButton.jsx";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function SearchBar({
                                      size,
                                      onSubmit,
                                      value,
                                      onChange,
                                      message,
                                      includeRandomButton = false,
                                      enableAdvancedSearch = false,
                                      onAdvancedSearchChange
                                  }) {
    const { theme } = useTheme();
    const [searchMode, setSearchMode] = useState('regular'); // 'regular', 'layered', 'uncategorized'
    const [isAnimating, setIsAnimating] = useState(false);
    const [availableNotes, setAvailableNotes] = useState([]);
    const [availableAccords, setAvailableAccords] = useState([]);
    const [selectedAccords, setSelectedAccords] = useState([]);
    const [excludedAccords, setExcludedAccords] = useState([]);
    const [selectedNotes, setSelectedNotes] = useState({
        top: [],
        middle: [],
        base: [],
        uncategorized: []
    });
    const [excludedNotes, setExcludedNotes] = useState({
        top: [],
        middle: [],
        base: [],
        uncategorized: []
    });
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Fetch available notes and accords
    useEffect(() => {
        if (enableAdvancedSearch) {
            fetchNotes();
            fetchAccords();
        }
    }, [enableAdvancedSearch]);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setTimeout(() => {
                    setActiveDropdown(null);
                    setSearchTerm('');
                }, 0);
            }
        };

        if (activeDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeDropdown]);

    // Notify parent of advanced search changes
    useEffect(() => {
        if (enableAdvancedSearch && onAdvancedSearchChange) {
            onAdvancedSearchChange({
                mode: searchMode,
                accords: selectedAccords,
                excludedAccords: excludedAccords,
                notes: selectedNotes,
                excludedNotes: excludedNotes
            });
        }
    }, [searchMode, JSON.stringify(selectedAccords), JSON.stringify(excludedAccords),
        JSON.stringify(selectedNotes), JSON.stringify(excludedNotes), enableAdvancedSearch]);

    const fetchNotes = async () => {
        try {
            const response = await fetch('/api/notes');
            if (response.ok) {
                const data = await response.json();
                const noteNames = Array.isArray(data)
                    ? data.map(item => typeof item === 'object' && item.name ? item.name : item)
                    : [];
                setAvailableNotes(noteNames);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            setAvailableNotes([]);
        }
    };

    const fetchAccords = async () => {
        try {
            const response = await fetch('/api/accords');
            if (response.ok) {
                const data = await response.json();
                const accordNames = Array.isArray(data)
                    ? data.map(item => typeof item === 'object' && item.name ? item.name : item)
                    : [];
                setAvailableAccords(accordNames);
            }
        } catch (error) {
            console.error('Error fetching accords:', error);
            setAvailableAccords([]);
        }
    };

    const handleModeSwitch = (newMode) => {
        if (newMode === 'regular' && searchMode !== 'regular') {
            setIsAnimating(true);
            setTimeout(() => {
                setSelectedAccords([]);
                setExcludedAccords([]);
                setSelectedNotes({ top: [], middle: [], base: [], uncategorized: [] });
                setExcludedNotes({ top: [], middle: [], base: [], uncategorized: [] });
                setSearchMode(newMode);
                setActiveDropdown(null);
                setSearchTerm('');
                setIsAnimating(false);
            }, 150);
        } else {
            setSelectedAccords([]);
            setExcludedAccords([]);
            setSelectedNotes({ top: [], middle: [], base: [], uncategorized: [] });
            setExcludedNotes({ top: [], middle: [], base: [], uncategorized: [] });
            setSearchMode(newMode);
            setActiveDropdown(null);
            setSearchTerm('');
        }
    };

    const addAccord = (accord) => {
        try {
            if (accord && !selectedAccords.includes(accord) && !excludedAccords.includes(accord)) {
                setSelectedAccords(prev => [...prev, accord]);
            }
        } catch (error) {
            console.error('Error adding accord:', error);
        } finally {
            setActiveDropdown(null);
            setSearchTerm('');
        }
    };

    const excludeAccord = (accord) => {
        try {
            if (accord && !excludedAccords.includes(accord) && !selectedAccords.includes(accord)) {
                setExcludedAccords(prev => [...prev, accord]);
            }
        } catch (error) {
            console.error('Error excluding accord:', error);
        } finally {
            setActiveDropdown(null);
            setSearchTerm('');
        }
    };

    const removeAccord = (accord) => {
        try {
            setSelectedAccords(prev => prev.filter(a => a !== accord));
        } catch (error) {
            console.error('Error removing accord:', error);
        }
    };

    const removeExcludedAccord = (accord) => {
        try {
            setExcludedAccords(prev => prev.filter(a => a !== accord));
        } catch (error) {
            console.error('Error removing excluded accord:', error);
        }
    };

    const addNote = (layer, note) => {
        try {
            if (note && selectedNotes[layer] && !selectedNotes[layer].includes(note) && !excludedNotes[layer].includes(note)) {
                setSelectedNotes(prev => ({
                    ...prev,
                    [layer]: [...(prev[layer] || []), note]
                }));
            }
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setActiveDropdown(null);
            setSearchTerm('');
        }
    };

    const excludeNote = (layer, note) => {
        try {
            if (note && excludedNotes[layer] && !excludedNotes[layer].includes(note) && !selectedNotes[layer].includes(note)) {
                setExcludedNotes(prev => ({
                    ...prev,
                    [layer]: [...(prev[layer] || []), note]
                }));
            }
        } catch (error) {
            console.error('Error excluding note:', error);
        } finally {
            setActiveDropdown(null);
            setSearchTerm('');
        }
    };

    const removeNote = (layer, note) => {
        try {
            setSelectedNotes(prev => ({
                ...prev,
                [layer]: (prev[layer] || []).filter(n => n !== note)
            }));
        } catch (error) {
            console.error('Error removing note:', error);
        }
    };

    const removeExcludedNote = (layer, note) => {
        try {
            setExcludedNotes(prev => ({
                ...prev,
                [layer]: (prev[layer] || []).filter(n => n !== note)
            }));
        } catch (error) {
            console.error('Error removing excluded note:', error);
        }
    };

    const getFilteredItems = (items, searchTerm, excludeSelected, excludeExcluded) => {
        if (!Array.isArray(items)) return [];
        let filtered = items;

        // Filter out already selected/excluded items
        if (excludeSelected && excludeExcluded) {
            const allUsed = [...(excludeSelected || []), ...(excludeExcluded || [])];
            filtered = items.filter(item => !allUsed.includes(item));
        }

        if (!searchTerm) return filtered.slice(0, 30);
        return filtered.filter(item =>
            item && typeof item === 'string' && item.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 30);
    };

    const renderDropdown = (items, onSelect, type, excludeSelected = [], excludeExcluded = []) => {
        if (!Array.isArray(items) || items.length === 0) {
            return (
                <div
                    ref={dropdownRef}
                    className={`absolute top-full right-0 mt-1 w-64 ${theme.bg.input} border ${theme.border.primary} rounded-lg shadow-lg z-50`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-3 text-center text-sm text-gray-500">
                        No {type} available
                    </div>
                </div>
            );
        }

        const filteredItems = getFilteredItems(items, searchTerm, excludeSelected, excludeExcluded);

        return (
            <div
                ref={dropdownRef}
                className={`absolute top-full right-0 mt-1 w-64 ${theme.bg.input} border ${theme.border.primary} rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            e.stopPropagation();
                            setSearchTerm(e.target.value);
                        }}
                        placeholder={`Search ${type}...`}
                        className={`w-full px-3 py-2 text-sm ${theme.bg.input} ${theme.text.primary} border ${theme.border.primary} rounded focus:outline-none`}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                    />
                </div>
                <div className="max-h-40 overflow-y-auto">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <button
                                key={`${type}-${index}-${item}`}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onSelect(item);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm ${theme.text.primary} hover:bg-blue-400 hover:${theme.text.secondary} transition-colors duration-200`}
                            >
                                {typeof item === 'string' ? item : (item?.name || 'Unknown')}
                            </button>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                            No available {type} to add
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderAdvancedSearch = () => (
        <div className={`space-y-3 sm:space-y-4`}>
            {/* Mode Selection */}
            <div className="flex justify-center space-x-3 sm:space-x-4">
                <button
                    onClick={() => handleModeSwitch('layered')}
                    type="button"
                    className={`cursor-pointer px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                        searchMode === 'layered'
                            ? `${theme.button.primary} text-white transform scale-105`
                            : `${theme.bg.input} ${theme.text.primary} border ${theme.border.primary} hover:scale-105`
                    }`}
                >
                    Layered Search
                </button>
                <button
                    onClick={() => handleModeSwitch('uncategorized')}
                    type="button"
                    className={`cursor-pointer px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                        searchMode === 'uncategorized'
                            ? `${theme.button.primary} text-white transform scale-105`
                            : `${theme.bg.input} ${theme.text.primary} border ${theme.border.primary} hover:scale-105`
                    }`}
                >
                    Uncategorized Search
                </button>
            </div>

            {/* Accords Section */}
            <div className="space-y-2 sm:space-y-3">
                {/* Include Accords */}
                <div className="space-y-2">
                    <div className="flex items-center justify-center relative">
                        <h3 className={`text-sm sm:text-base md:text-lg font-semibold ${theme.text.other_accent}`}>Include Accords</h3>
                        <div className="absolute right-0">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === 'accords-include' ? null : 'accords-include');
                                }}
                                type="button"
                                className={`cursor-pointer ${theme.button.primary} p-1.5 sm:p-2 rounded-lg hover:scale-105 transition-all duration-300`}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            {activeDropdown === 'accords-include' && availableAccords.length > 0 &&
                                renderDropdown(availableAccords, addAccord, 'accords', selectedAccords, excludedAccords)}
                        </div>
                    </div>
                    <div className="min-h-[2rem] p-2 border border-green-600/30 rounded-lg flex flex-wrap gap-1.5 sm:gap-2 justify-center bg-green-900/10">
                        {selectedAccords.map((accord, index) => (
                            <span
                                key={index}
                                className={`px-2 sm:px-3 py-1 sm:py-1.5 bg-green-900/30 rounded-lg text-xs sm:text-sm border border-green-700 flex items-center space-x-1 sm:space-x-2 animate-slideIn text-green-300`}
                                style={{animationDelay: `${index * 50}ms`}}
                            >
                                <span>{accord}</span>
                                <button
                                    onClick={() => removeAccord(accord)}
                                    type="button"
                                    className="cursor-pointer text-red-500 hover:text-red-200 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-lg font-bold leading-none transition-all duration-200"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Exclude Accords */}
                <div className="space-y-2">
                    <div className="flex items-center justify-center relative">
                        <h3 className={`text-sm sm:text-base md:text-lg font-semibold ${theme.text.other_accent}`}>Exclude Accords</h3>
                        <div className="absolute right-0">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === 'accords-exclude' ? null : 'accords-exclude');
                                }}
                                type="button"
                                className={`cursor-pointer bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg hover:scale-105 transition-all duration-300`}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            {activeDropdown === 'accords-exclude' && availableAccords.length > 0 &&
                                renderDropdown(availableAccords, excludeAccord, 'accords', selectedAccords, excludedAccords)}
                        </div>
                    </div>
                    <div className="min-h-[2rem] p-2 border border-red-600/30 rounded-lg flex flex-wrap gap-1.5 sm:gap-2 justify-center bg-red-900/10">
                        {excludedAccords.map((accord, index) => (
                            <span
                                key={index}
                                className={`px-2 sm:px-3 py-1 sm:py-1.5 bg-red-900/30 rounded-lg text-xs sm:text-sm border border-red-700 flex items-center space-x-1 sm:space-x-2 animate-slideIn text-red-300`}
                                style={{animationDelay: `${index * 50}ms`}}
                            >
                                <span>{accord}</span>
                                <button
                                    onClick={() => removeExcludedAccord(accord)}
                                    type="button"
                                    className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full w-5 h-5 flex items-center justify-center text-lg font-bold leading-none transition-all duration-200"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notes Sections */}
            {searchMode === 'layered' && (
                <div className="animate-slideDown">
                    <div className={`w-full h-px ${theme.border.primary} mb-4 rounded-full`}></div>

                    {['top', 'middle', 'base'].map((layer) => (
                        <div key={layer} className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                            <h3 className={`text-center text-sm sm:text-base md:text-lg font-bold ${theme.text.other_accent} mb-3`}>
                                {layer.charAt(0).toUpperCase() + layer.slice(1)} Notes
                            </h3>

                            {/* Include Notes */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-center relative">
                                    <h4 className={`text-xs sm:text-sm font-semibold ${theme.text.primary}`}>Include</h4>
                                    <div className="absolute right-0">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setActiveDropdown(activeDropdown === `${layer}-include` ? null : `${layer}-include`);
                                            }}
                                            type="button"
                                            className={`cursor-pointer ${theme.button.primary} p-1.5 sm:p-2 rounded-lg hover:scale-105 transition-all duration-300`}
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        {activeDropdown === `${layer}-include` && availableNotes.length > 0 &&
                                            renderDropdown(availableNotes, (note) => addNote(layer, note), 'notes', selectedNotes[layer], excludedNotes[layer])}
                                    </div>
                                </div>
                                <div className={`min-h-[2rem] p-2 border border-green-600/30 rounded-lg flex flex-wrap gap-1.5 sm:gap-2 justify-center bg-green-900/10`}>
                                    {selectedNotes[layer].map((note, index) => (
                                        <span
                                            key={index}
                                            className={`px-2 sm:px-3 py-1 sm:py-1.5 bg-green-900/30 rounded-lg text-xs sm:text-sm border border-green-700 flex items-center space-x-1 sm:space-x-2 animate-slideIn text-green-300`}
                                            style={{animationDelay: `${index * 50}ms`}}
                                        >
                                            <span>{note}</span>
                                            <button
                                                onClick={() => removeNote(layer, note)}
                                                type="button"
                                                className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full w-5 h-5 flex items-center justify-center text-lg font-bold leading-none transition-all duration-200"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Exclude Notes */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-center relative">
                                    <h4 className={`text-xs sm:text-sm font-semibold ${theme.text.primary}`}>Exclude</h4>
                                    <div className="absolute right-0">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setActiveDropdown(activeDropdown === `${layer}-exclude` ? null : `${layer}-exclude`);
                                            }}
                                            type="button"
                                            className={`cursor-pointer bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg hover:scale-105 transition-all duration-300`}
                                        >
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        {activeDropdown === `${layer}-exclude` && availableNotes.length > 0 &&
                                            renderDropdown(availableNotes, (note) => excludeNote(layer, note), 'notes', selectedNotes[layer], excludedNotes[layer])}
                                    </div>
                                </div>
                                <div className={`min-h-[2rem] p-2 border border-red-600/30 rounded-lg flex flex-wrap gap-1.5 sm:gap-2 justify-center bg-red-900/10`}>
                                    {excludedNotes[layer].map((note, index) => (
                                        <span
                                            key={index}
                                            className={`px-2 sm:px-3 py-1 sm:py-1.5 bg-red-900/30 rounded-lg text-xs sm:text-sm border border-red-700 flex items-center space-x-1 sm:space-x-2 animate-slideIn text-red-300`}
                                            style={{animationDelay: `${index * 50}ms`}}
                                        >
                                            <span>{note}</span>
                                            <button
                                                onClick={() => removeExcludedNote(layer, note)}
                                                type="button"
                                                className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full w-5 h-5 flex items-center justify-center text-lg font-bold leading-none transition-all duration-200"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {searchMode === 'uncategorized' && (
                <div className="space-y-2 sm:space-y-3 animate-slideDown">
                    <div className={`w-full h-px ${theme.border.primary} mb-4 rounded-full`}></div>
                    <h3 className={`text-center text-sm sm:text-base md:text-lg font-bold ${theme.text.other_accent} mb-3`}>
                        Uncategorized Notes
                    </h3>

                    {/* Include Uncategorized Notes */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center relative">
                            <h4 className={`text-xs sm:text-sm font-semibold ${theme.text.primary}`}>Include</h4>
                            <div className="absolute right-0">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveDropdown(activeDropdown === 'uncategorized-include' ? null : 'uncategorized-include');
                                    }}
                                    type="button"
                                    className={`cursor-pointer ${theme.button.primary} p-1.5 sm:p-2 rounded-lg hover:scale-105 transition-all duration-300`}
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                {activeDropdown === 'uncategorized-include' && availableNotes.length > 0 &&
                                    renderDropdown(availableNotes, (note) => addNote('uncategorized', note), 'notes', selectedNotes.uncategorized, excludedNotes.uncategorized)}
                            </div>
                        </div>
                        <div className={`min-h-[2rem] p-2 border border-green-600/30 rounded-lg bg-green-900/10`}>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                                {selectedNotes.uncategorized.map((note, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 bg-green-900/30 rounded-lg text-xs sm:text-sm border border-green-700 flex items-center space-x-1 sm:space-x-2 animate-slideIn text-green-300`}
                                        style={{animationDelay: `${index * 50}ms`}}
                                    >
                                        <span>{note}</span>
                                        <button
                                            onClick={() => removeNote('uncategorized', note)}
                                            type="button"
                                            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full w-5 h-5 flex items-center justify-center text-lg font-bold leading-none transition-all duration-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Exclude Uncategorized Notes */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center relative">
                            <h4 className={`text-xs sm:text-sm font-semibold ${theme.text.primary}`}>Exclude</h4>
                            <div className="absolute right-0">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveDropdown(activeDropdown === 'uncategorized-exclude' ? null : 'uncategorized-exclude');
                                    }}
                                    type="button"
                                    className={`cursor-pointer bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg hover:scale-105 transition-all duration-300`}
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                {activeDropdown === 'uncategorized-exclude' && availableNotes.length > 0 &&
                                    renderDropdown(availableNotes, (note) => excludeNote('uncategorized', note), 'notes', selectedNotes.uncategorized, excludedNotes.uncategorized)}
                            </div>
                        </div>
                        <div className={`min-h-[2rem] p-2 border border-red-600/30 rounded-lg bg-red-900/10`}>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                                {excludedNotes.uncategorized.map((note, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 bg-red-900/30 rounded-lg text-xs sm:text-sm border border-red-700 flex items-center space-x-1 sm:space-x-2 animate-slideIn text-red-300`}
                                        style={{animationDelay: `${index * 50}ms`}}
                                    >
                                        <span>{note}</span>
                                        <button
                                            onClick={() => removeExcludedNote('uncategorized', note)}
                                            type="button"
                                            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full w-5 h-5 flex items-center justify-center text-lg font-bold leading-none transition-all duration-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderRegularSearch = () => (
        <div className={`relative flex-1 group ${searchMode === 'regular' && !isAnimating ? 'animate-expandDown' : ''}`}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={message}
                className={`
                    w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 lg:py-6 
                    text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl 
                    ${theme.bg.input} ${theme.border.primary} ${theme.text.primary}
                    border rounded-lg sm:rounded-xl md:rounded-2xl focus:outline-none
                    transition-all duration-300 ${theme.border.hover} 
                    placeholder-gray-500
                `}
            />
            <button
                type="submit"
                className={`absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 ${theme.button.primary} p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105`}
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    );

    return (
        <form onSubmit={onSubmit} className={`max-w-${size}xl mx-auto px-2 sm:px-0`}>
            <style jsx>{`
                @keyframes expandDown {
                    from {
                        opacity: 0;
                        transform: scaleY(0.3);
                        transform-origin: top;
                    }
                    to {
                        opacity: 1;
                        transform: scaleY(1);
                        transform-origin: top;
                    }
                }

                @keyframes shrinkUp {
                    from {
                        opacity: 1;
                        transform: scaleY(1);
                        transform-origin: top;
                    }
                    to {
                        opacity: 0;
                        transform: scaleY(0.3);
                        transform-origin: top;
                    }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                        max-height: 1000px;
                    }
                }

                .animate-expandDown {
                    animation: expandDown 0.15s ease-out;
                }

                .animate-shrinkUp {
                    animation: shrinkUp 0.15s ease-out;
                    animation-fill-mode: forwards;
                }

                .animate-slideIn {
                    animation: slideIn 0.4s ease-out;
                    animation-fill-mode: both;
                }

                .animate-slideDown {
                    animation: slideDown 0.5s ease-out;
                }
            `}</style>
            <div className="space-y-3 sm:space-y-4">
                {/* Toggle Button Row */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    {searchMode === 'regular' ? renderRegularSearch() : (
                        <div className={`flex-1 p-3 sm:p-4 ${theme.bg.input} border ${theme.border.primary} rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 ${isAnimating ? 'animate-shrinkUp' : 'animate-expandDown'}`}>
                            {renderAdvancedSearch()}
                        </div>
                    )}

                    {enableAdvancedSearch && (
                        <button
                            type="button"
                            onClick={() => handleModeSwitch(searchMode === 'regular' ? 'layered' : 'regular')}
                            className={`cursor-pointer ${theme.button.primary} p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 transform`}
                        >
                            {searchMode === 'regular' ? (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round"/>
                                    <circle cx="7" cy="6" r="2" fill="currentColor"/>
                                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                                    <circle cx="17" cy="18" r="2" fill="currentColor"/>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </button>
                    )}

                    {includeRandomButton && (
                        <RandomFragranceButton
                            className={`cursor-pointer group relative inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 text-base sm:text-lg md:text-xl font-bold ${theme.text.primary} bg-gradient-to-r ${theme.randomDiscoveryButton.primary} rounded-full shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-105 transform hover:-translate-y-1 border border-gray-500/30`}
                        />
                    )}
                </div>
            </div>
        </form>
    );
}
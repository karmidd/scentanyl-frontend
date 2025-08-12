// src/hooks/useFragranceFilter.js
import { useState, useMemo, useCallback } from 'react';
import {useDebouncedValue} from "./useDebouncedValue.jsx";

// Main fragrance filter hook with exclusion support and year filtering
export const useFragranceFilter = () => {
    const [fragrances, setFragrances] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const [advancedSearchData, setAdvancedSearchData] = useState({
        mode: 'regular',
        accords: [],
        excludedAccords: [],
        notes: { top: [], middle: [], base: [], uncategorized: [] },
        excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
    });
    const [yearRange, setYearRange] = useState(null); // null means no filter
    const [yearSort, setYearSort] = useState('none'); // 'none', 'newest', 'oldest'

    // Debounced search query
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    // Memoized advanced search matcher with exclusion logic
    const matchesAdvancedSearch = useCallback((fragrance) => {
        if (advancedSearchData.mode === 'regular') {
            return true;
        }

        // Check included accords (fragrance must have ALL included accords)
        if (advancedSearchData.accords && advancedSearchData.accords.length > 0) {
            const fragranceAccords = fragrance.accords?.toLowerCase().split(',').map(a => a.trim()) || [];
            const hasAllAccords = advancedSearchData.accords.every(accord =>
                fragranceAccords.some(fa => fa.includes(accord.toLowerCase()))
            );
            if (!hasAllAccords) return false;
        }

        // Check excluded accords (fragrance must NOT have ANY excluded accords)
        if (advancedSearchData.excludedAccords && advancedSearchData.excludedAccords.length > 0) {
            const fragranceAccords = fragrance.accords?.toLowerCase().split(',').map(a => a.trim()) || [];
            const hasExcludedAccord = advancedSearchData.excludedAccords.some(accord =>
                fragranceAccords.some(fa => fa.includes(accord.toLowerCase()))
            );
            if (hasExcludedAccord) return false;
        }

        // Check notes based on mode
        if (advancedSearchData.mode === 'layered') {
            const noteTypes = [
                { type: 'top', key: 'topNotes' },
                { type: 'middle', key: 'middleNotes' },
                { type: 'base', key: 'baseNotes' }
            ];

            for (const { type, key } of noteTypes) {
                const fragranceNotes = fragrance[key]?.toLowerCase().split(',').map(n => n.trim()) || [];

                // Check included notes (must have ALL included notes for this layer)
                if (advancedSearchData.notes[type] && advancedSearchData.notes[type].length > 0) {
                    const hasAllNotes = advancedSearchData.notes[type].every(note =>
                        fragranceNotes.some(fn => fn.includes(note.toLowerCase()))
                    );
                    if (!hasAllNotes) return false;
                }

                // Check excluded notes (must NOT have ANY excluded notes for this layer)
                if (advancedSearchData.excludedNotes && advancedSearchData.excludedNotes[type] &&
                    advancedSearchData.excludedNotes[type].length > 0) {
                    const hasExcludedNote = advancedSearchData.excludedNotes[type].some(note =>
                        fragranceNotes.some(fn => fn.includes(note.toLowerCase()))
                    );
                    if (hasExcludedNote) return false;
                }
            }
        } else if (advancedSearchData.mode === 'uncategorized') {
            const fragranceNotes = fragrance.uncategorizedNotes?.toLowerCase().split(',').map(n => n.trim()) || [];

            // Check included uncategorized notes
            if (advancedSearchData.notes.uncategorized && advancedSearchData.notes.uncategorized.length > 0) {
                const hasAllNotes = advancedSearchData.notes.uncategorized.every(note =>
                    fragranceNotes.some(fn => fn.includes(note.toLowerCase()))
                );
                if (!hasAllNotes) return false;
            }

            // Check excluded uncategorized notes
            if (advancedSearchData.excludedNotes && advancedSearchData.excludedNotes.uncategorized &&
                advancedSearchData.excludedNotes.uncategorized.length > 0) {
                const hasExcludedNote = advancedSearchData.excludedNotes.uncategorized.some(note =>
                    fragranceNotes.some(fn => fn.includes(note.toLowerCase()))
                );
                if (hasExcludedNote) return false;
            }
        }

        return true;
    }, [advancedSearchData]);

    // Memoized filtered fragrances with year filtering and sorting
    const filteredFragrances = useMemo(() => {
        let filtered = fragrances;

        // Apply advanced search filter first
        if (advancedSearchData.mode !== 'regular') {
            filtered = filtered.filter(matchesAdvancedSearch);
        } else if (debouncedSearchQuery.trim()) {
            // Apply regular search filter with debounced value
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter(fragrance =>
                fragrance.name?.toLowerCase().includes(query) ||
                fragrance.brand?.toLowerCase().includes(query) ||
                fragrance.accords?.toLowerCase().includes(query) ||
                fragrance.uncategorizedNotes?.toLowerCase().includes(query) ||
                fragrance.topNotes?.toLowerCase().includes(query) ||
                fragrance.middleNotes?.toLowerCase().includes(query) ||
                fragrance.baseNotes?.toLowerCase().includes(query)
            );
        }

        // Filter by gender
        if (selectedGender !== 'all') {
            filtered = filtered.filter(fragrance =>
                fragrance.gender?.toLowerCase() === selectedGender.toLowerCase()
            );
        }

        // Apply year range filter
        if (yearRange && yearRange.length === 2) {
            filtered = filtered.filter(fragrance => {
                const year = fragrance.year;
                if (!year) return false; // Exclude fragrances without year data
                return year >= yearRange[0] && year <= yearRange[1];
            });
        }

        // Apply year sorting
        if (yearSort !== 'none') {
            // Create a copy to avoid mutating the original array
            filtered = [...filtered].sort((a, b) => {
                const yearA = a.year || 0;
                const yearB = b.year || 0;

                if (yearSort === 'newest') {
                    return yearB - yearA; // Descending order (newest first)
                } else if (yearSort === 'oldest') {
                    return yearA - yearB; // Ascending order (oldest first)
                }
                return 0;
            });
        }

        return filtered;
    }, [fragrances, debouncedSearchQuery, selectedGender, advancedSearchData, matchesAdvancedSearch, yearRange, yearSort]);

    // Memoized gender counts
    const genderCounts = useMemo(() => {
        const counts = {
            all: fragrances.length,
            men: 0,
            women: 0,
            unisex: 0
        };

        fragrances.forEach(fragrance => {
            const gender = fragrance.gender?.toLowerCase();
            if (gender === 'men') counts.men++;
            else if (gender === 'women') counts.women++;
            else if (gender === 'unisex') counts.unisex++;
        });

        return counts;
    }, [fragrances]);

    // Helper function to check if any filters are active
    const hasActiveFilters = useMemo(() => {
        // Check year filter
        const hasYearFilter = yearRange !== null || yearSort !== 'none';

        if (advancedSearchData.mode !== 'regular') {
            const hasIncludedItems =
                (advancedSearchData.accords && advancedSearchData.accords.length > 0) ||
                Object.values(advancedSearchData.notes || {}).some(notes => notes && notes.length > 0);

            const hasExcludedItems =
                (advancedSearchData.excludedAccords && advancedSearchData.excludedAccords.length > 0) ||
                Object.values(advancedSearchData.excludedNotes || {}).some(notes => notes && notes.length > 0);

            return hasIncludedItems || hasExcludedItems || hasYearFilter;
        }
        return debouncedSearchQuery.trim() !== '' || selectedGender !== 'all' || hasYearFilter;
    }, [advancedSearchData, debouncedSearchQuery, selectedGender, yearRange, yearSort]);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedGender('all');
        setAdvancedSearchData({
            mode: 'regular',
            accords: [],
            excludedAccords: [],
            notes: { top: [], middle: [], base: [], uncategorized: [] },
            excludedNotes: { top: [], middle: [], base: [], uncategorized: [] }
        });
        setYearRange(null);
        setYearSort('none');
    }, []);

    return {
        fragrances,
        setFragrances,
        filteredFragrances,
        searchQuery,
        setSearchQuery,
        selectedGender,
        setSelectedGender,
        advancedSearchData,
        setAdvancedSearchData,
        yearRange,
        setYearRange,
        yearSort,
        setYearSort,
        genderCounts,
        matchesAdvancedSearch,
        debouncedSearchQuery,
        hasActiveFilters,
        clearAllFilters
    };
};
// src/hooks/useFragranceFilter.js
import { useState, useMemo, useCallback } from 'react';
import {useDebouncedValue} from "./useDebouncedValue.jsx";

// Main fragrance filter hook
export const useFragranceFilter = () => {
    const [fragrances, setFragrances] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const [advancedSearchData, setAdvancedSearchData] = useState({
        mode: 'regular',
        accords: [],
        notes: { top: [], middle: [], base: [], uncategorized: [] }
    });

    // Debounced search query
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    // Memoized advanced search matcher
    const matchesAdvancedSearch = useCallback((fragrance) => {
        if (advancedSearchData.mode === 'regular') {
            return true;
        }

        // Check accords
        if (advancedSearchData.accords.length > 0) {
            const fragranceAccords = fragrance.accords?.toLowerCase().split(',').map(a => a.trim()) || [];
            const hasAllAccords = advancedSearchData.accords.every(accord =>
                fragranceAccords.some(fa => fa.includes(accord.toLowerCase()))
            );
            if (!hasAllAccords) return false;
        }

        // Check notes based on mode
        if (advancedSearchData.mode === 'layered') {
            const noteTypes = [
                { type: 'top', key: 'topNotes' },
                { type: 'middle', key: 'middleNotes' },
                { type: 'base', key: 'baseNotes' }
            ];

            for (const { type, key } of noteTypes) {
                if (advancedSearchData.notes[type].length > 0) {
                    const fragranceNotes = fragrance[key]?.toLowerCase().split(',').map(n => n.trim()) || [];
                    const hasAllNotes = advancedSearchData.notes[type].every(note =>
                        fragranceNotes.some(fn => fn.includes(note.toLowerCase()))
                    );
                    if (!hasAllNotes) return false;
                }
            }
        } else if (advancedSearchData.mode === 'uncategorized' && advancedSearchData.notes.uncategorized.length > 0) {
            const fragranceNotes = fragrance.uncategorizedNotes?.toLowerCase().split(',').map(n => n.trim()) || [];
            const hasAllNotes = advancedSearchData.notes.uncategorized.every(note =>
                fragranceNotes.some(fn => fn.includes(note.toLowerCase()))
            );
            if (!hasAllNotes) return false;
        }

        return true;
    }, [advancedSearchData]);

    // Memoized filtered fragrances
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

        return filtered;
    }, [fragrances, debouncedSearchQuery, selectedGender, advancedSearchData, matchesAdvancedSearch]);

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
        genderCounts,
        matchesAdvancedSearch,
        debouncedSearchQuery
    };
};
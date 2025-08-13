import {useMemo, useState} from "react";
import {useDebouncedValue} from "./useDebouncedValue.jsx";

export const useItemFilter = (sortOptions = ['alphabetical', 'fragranceCount']) => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(sortOptions[0]);

    // Debounced search
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    // Memoized filtered and sorted items
    const filteredItems = useMemo(() => {
        let filtered = items;

        // Search filter
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name?.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortBy === 'alphabetical') {
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'fragranceCount') {
            // Use totalAppearances or totalContributions based on item type
            filtered = [...filtered].sort((a, b) =>
                (b.totalFragrances || 0) -
                (a.totalFragrances || 0)
            );
        }

        return filtered;
    }, [items, debouncedSearchQuery, sortBy]);

    return {
        items,
        setItems,
        filteredItems,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        debouncedSearchQuery
    };
};
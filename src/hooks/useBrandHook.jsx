import {useCallback, useMemo, useState} from "react";
import {useDebouncedValue} from "./useDebouncedValue.jsx";

export const useBrandFilter = () => {
    const [brands, setBrands] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedParent, setSelectedParent] = useState('');

    // Debounced search
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    // Get unique countries and parents
    const uniqueCountries = useMemo(() => {
        return brands
            .map(brand => brand.country)
            .filter(country => country !== null && country !== undefined && country !== '')
            .filter((country, index, self) => self.indexOf(country) === index)
            .sort();
    }, [brands]);

    const uniqueParents = useMemo(() => {
        return brands
            .map(brand => brand.parent)
            .filter(parent => parent !== null && parent !== undefined && parent !== '')
            .filter((parent, index, self) => self.indexOf(parent) === index)
            .sort();
    }, [brands]);

    // Memoized filtered brands
    const filteredBrands = useMemo(() => {
        let filtered = brands;

        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter(brand =>
                brand.name?.toLowerCase().includes(query)
            );
        }

        if (selectedCountry) {
            filtered = filtered.filter(brand => brand.country === selectedCountry);
        }

        if (selectedParent) {
            filtered = filtered.filter(brand => brand.parent === selectedParent);
        }

        return filtered;
    }, [brands, debouncedSearchQuery, selectedCountry, selectedParent]);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedCountry('');
        setSelectedParent('');
    }, []);

    return {
        brands,
        setBrands,
        filteredBrands,
        searchQuery,
        setSearchQuery,
        selectedCountry,
        setSelectedCountry,
        selectedParent,
        setSelectedParent,
        uniqueCountries,
        uniqueParents,
        clearFilters,
        debouncedSearchQuery
    };
};

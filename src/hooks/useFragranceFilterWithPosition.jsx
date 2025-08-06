import {useFragranceFilter} from "./useFragranceFilter.jsx";
import {useMemo, useState} from "react";

export const useFragranceFilterWithPosition = () => {
    const baseFilter = useFragranceFilter();
    const [selectedPosition, setSelectedPosition] = useState('all');
    const [noteParam, setNoteParam] = useState('');

    // Extended filter that includes position
    const filteredFragrances = useMemo(() => {
        let filtered = baseFilter.filteredFragrances;

        if (selectedPosition !== 'all' && noteParam) {
            const noteLower = noteParam.toLowerCase();
            filtered = filtered.filter(fragrance => {
                switch (selectedPosition) {
                    case 'top':
                        return fragrance.topNotes && fragrance.topNotes.toLowerCase().includes(noteLower);
                    case 'middle':
                        return fragrance.middleNotes && fragrance.middleNotes.toLowerCase().includes(noteLower);
                    case 'base':
                        return fragrance.baseNotes && fragrance.baseNotes.toLowerCase().includes(noteLower);
                    case 'uncategorized':
                        return fragrance.uncategorizedNotes && fragrance.uncategorizedNotes.toLowerCase().includes(noteLower);
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [baseFilter.filteredFragrances, selectedPosition, noteParam]);

    return {
        ...baseFilter,
        selectedPosition,
        setSelectedPosition,
        noteParam,
        setNoteParam,
        filteredFragrances
    };
};
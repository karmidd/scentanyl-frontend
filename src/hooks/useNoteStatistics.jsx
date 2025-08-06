import {useMemo} from "react";

export const useNoteStatistics = (fragrances, note) => {
    return useMemo(() => {
        const stats = {
            total: fragrances.length,
            topNotes: 0,
            middleNotes: 0,
            baseNotes: 0,
            uncategorizedNotes: 0
        };

        if (!note) return stats;

        const noteLower = note.toLowerCase();

        fragrances.forEach(fragrance => {
            if (fragrance.topNotes && fragrance.topNotes.toLowerCase().includes(noteLower)) {
                stats.topNotes++;
            }
            if (fragrance.middleNotes && fragrance.middleNotes.toLowerCase().includes(noteLower)) {
                stats.middleNotes++;
            }
            if (fragrance.baseNotes && fragrance.baseNotes.toLowerCase().includes(noteLower)) {
                stats.baseNotes++;
            }
            if (fragrance.uncategorizedNotes && fragrance.uncategorizedNotes.toLowerCase().includes(noteLower)) {
                stats.uncategorizedNotes++;
            }
        });

        return stats;
    }, [fragrances, note]);
};
// src/hooks/useSearchMode.js
import {useMemo} from "react";

export const useSearchMode = (advancedSearchData) => {
    return useMemo(() => {
        if (advancedSearchData.mode === 'regular') {
            return 'Standard search mode';
        } else if (advancedSearchData.mode === 'layered') {
            return 'Advanced layered search mode';
        } else {
            return 'Advanced uncategorized search mode';
        }
    }, [advancedSearchData.mode]);
};
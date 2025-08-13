import { useMemo } from "react";

export function useYearRange(fragrances) {
    return useMemo(() => {
        const MIN_YEAR_IN_DB = 1533;
        const MAX_YEAR = new Date().getFullYear();

        if (!fragrances || fragrances.length === 0) {
            return [MIN_YEAR_IN_DB, MAX_YEAR];
        }

        const years = fragrances
            .map(f => f.year)
            .filter(year => year != null && year > 0);

        if (years.length === 0) {
            return [MIN_YEAR_IN_DB, MAX_YEAR];
        }

        return [Math.min(...years), Math.max(...years)];
    }, [fragrances]);
}
import {useCallback, useMemo, useState} from "react";

export const usePagination = (items, itemsPerPage = 20) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const displayedItems = useMemo(() => {
        return items.slice(0, itemsPerPage * currentPage);
    }, [items, itemsPerPage, currentPage]);

    const hasMore = useMemo(() => {
        return items.length > itemsPerPage * currentPage;
    }, [items.length, itemsPerPage, currentPage]);

    const loadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);

        setTimeout(() => {
            setCurrentPage(prev => prev + 1);
            setIsLoadingMore(false);
        }, 300);
    }, [isLoadingMore, hasMore]);

    const reset = useCallback(() => {
        setCurrentPage(1);
    }, []);

    return {
        displayedItems,
        hasMore,
        isLoadingMore,
        loadMore,
        reset,
        currentPage
    };
};
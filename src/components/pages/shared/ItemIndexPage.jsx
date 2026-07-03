import React, { useState, useEffect, useCallback, memo } from 'react';
import LoadingPage from '../primary/LoadingPage.jsx';
import PageLayout from '../../primary/PageLayout.jsx';
import PageHero from '../../ui/PageHero.jsx';
import SearchLine from '../../ui/SearchLine.jsx';
import Seg from '../../ui/Seg.jsx';
import ResultsLine from '../../ui/ResultsLine.jsx';
import CatalogueGrid from '../../ui/CatalogueGrid.jsx';
import IndexCard from '../../ui/IndexCard.jsx';
import LoadMoreRow from '../../ui/LoadMoreRow.jsx';
import EmptyState from '../../ui/EmptyState.jsx';
import { useItemFilter } from '../../../hooks/useItemFilter.jsx';
import { usePagination } from '../../../hooks/usePagination.jsx';
import { apiFetch } from '../../utils/apiFetch.jsx';

const MemoizedIndexCard = memo(IndexCard);

/**
 * Shared index page for notes / accords / perfumers: a hairline catalogue of
 * {name, totalFragrances} items with search + sort. Config-driven so the
 * three pages stay thin wrappers around the same data flow.
 */
export default function ItemIndexPage({
    endpoint, routeBase, headerNum, docTitle,
    heroTitle, heroSubLine, typeLabel, itemEyebrow,
    searchPlaceholder,
}) {
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        document.title = docTitle;
    }, [docTitle]);

    const {
        setItems,
        filteredItems,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
    } = useItemFilter(['alphabetical', 'fragranceCount']);

    const {
        displayedItems,
        hasMore,
        isLoadingMore,
        loadMore,
        reset: resetPagination
    } = usePagination(filteredItems, 20);

    useEffect(() => {
        resetPagination();
    }, [searchQuery, sortBy, resetPagination]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await apiFetch(`${API_BASE_URL}${endpoint}`);
                const data = await response.json();
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.error(`Error fetching ${typeLabel}:`, error);
                setLoading(false);
            }
        };
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [API_BASE_URL, endpoint]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <PageLayout headerNum={headerNum}>
            <PageHero
                title={heroTitle}
                sub={filteredItems.length.toLocaleString()}
                subLines={[heroSubLine]}
            />

            <SearchLine
                value={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
                placeholder={searchPlaceholder}
            />

            <div className="filter-bar">
                <div className="fb-group">
                    <span className="lbl">Order</span>
                    <Seg
                        value={sortBy}
                        onChange={setSortBy}
                        options={[
                            { value: 'alphabetical', label: 'A → Z' },
                            { value: 'fragranceCount', label: 'Most fragrances' },
                        ]}
                    />
                </div>
            </div>

            <ResultsLine shown={displayedItems.length} total={filteredItems.length} type={typeLabel} />

            {displayedItems.length > 0 ? (
                <>
                    <CatalogueGrid>
                        {displayedItems.map((item, index) => (
                            <MemoizedIndexCard
                                key={item.id || item.name || index}
                                index={index}
                                to={`${routeBase}/${encodeURIComponent(item.name)}`}
                                eyebrow={itemEyebrow}
                                name={item.name}
                                footLeft={item.totalFragrances != null
                                    ? `${Number(item.totalFragrances).toLocaleString()} ${item.totalFragrances === 1 ? 'fragrance' : 'fragrances'}`
                                    : '—'}
                            />
                        ))}
                    </CatalogueGrid>
                    {hasMore ? (
                        <LoadMoreRow
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            label={`↓ Load more ${typeLabel}`}
                            note={`${displayedItems.length} of ${filteredItems.length.toLocaleString()}`}
                        />
                    ) : (
                        <div style={{ paddingBottom: 80 }} />
                    )}
                </>
            ) : (
                <EmptyState big={`No ${typeLabel} match.`} small="try adjusting your search terms" />
            )}
        </PageLayout>
    );
}

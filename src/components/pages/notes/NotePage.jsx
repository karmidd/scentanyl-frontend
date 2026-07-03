import React from 'react';
import { useParams } from 'react-router-dom';
import TaggedFragrancesPage from '../shared/TaggedFragrancesPage.jsx';

const NotePage = () => {
    const { note } = useParams();
    return (
        <TaggedFragrancesPage
            value={note}
            endpointBase="/api/notes"
            headerNum={3}
            kindLabel="Note"
            listRoute="/notes"
            listLabel="Notes"
            withPositionFilter
            statsInit={{
                totalFragrances: 0,
                topNotes: 0,
                middleNotes: 0,
                baseNotes: 0,
                uncategorizedNotes: 0,
                minYear: null,
                maxYear: null
            }}
            statsToYears={(stats) => [stats.minYear, stats.maxYear]}
            statsToBand={(stats) => [
                { value: stats.totalFragrances, label: 'total fragrances', accent: true },
                { value: stats.topNotes, label: 'as a top note' },
                { value: stats.middleNotes, label: 'as a heart note' },
                { value: stats.baseNotes, label: 'as a base note' },
                { value: stats.uncategorizedNotes, label: 'uncategorized' },
            ]}
        />
    );
};

export default NotePage;

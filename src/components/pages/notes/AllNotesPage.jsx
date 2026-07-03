import React from 'react';
import ItemIndexPage from '../shared/ItemIndexPage.jsx';

const AllNotesPage = () => (
    <ItemIndexPage
        endpoint="/api/notes"
        routeBase="/notes"
        headerNum={3}
        docTitle="Notes | Scentanyl"
        heroTitle="Every note."
        heroSubLine="notes in the index"
        typeLabel="notes"
        itemEyebrow="Note"
        searchPlaceholder="Search for notes…"
    />
);

export default AllNotesPage;

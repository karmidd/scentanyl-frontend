import React from 'react';
import ItemIndexPage from '../shared/ItemIndexPage.jsx';

const AllAccordsPage = () => (
    <ItemIndexPage
        endpoint="/api/accords"
        routeBase="/accords"
        headerNum={4}
        docTitle="Accords | Scentanyl"
        heroTitle="The accords."
        heroSubLine="accords in the index"
        typeLabel="accords"
        itemEyebrow="Accord"
        searchPlaceholder="Search for accords…"
    />
);

export default AllAccordsPage;

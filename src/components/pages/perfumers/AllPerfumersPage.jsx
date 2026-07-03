import React from 'react';
import ItemIndexPage from '../shared/ItemIndexPage.jsx';

const AllPerfumersPage = () => (
    <ItemIndexPage
        endpoint="/api/perfumers"
        routeBase="/perfumers"
        headerNum={5}
        docTitle="Perfumers | Scentanyl"
        heroTitle="The perfumers."
        heroSubLine="noses in the index"
        typeLabel="perfumers"
        itemEyebrow="Perfumer"
        searchPlaceholder="Search for perfumers…"
    />
);

export default AllPerfumersPage;

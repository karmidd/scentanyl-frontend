import React from 'react';
import { useParams } from 'react-router-dom';
import TaggedFragrancesPage from '../shared/TaggedFragrancesPage.jsx';

const AccordPage = () => {
    const { accord } = useParams();
    return (
        <TaggedFragrancesPage
            value={accord}
            endpointBase="/api/accords"
            headerNum={4}
            kindLabel="Accord"
            listRoute="/accords"
            listLabel="Accords"
            statsInit={{
                genderCounts: { all: 0, men: 0, women: 0, unisex: 0 },
                minYear: null,
                maxYear: null
            }}
            statsToYears={(stats) => [stats.minYear, stats.maxYear]}
            statsToBand={(stats) => [
                { value: stats.genderCounts?.all ?? 0, label: 'total fragrances', accent: true },
                { value: stats.genderCounts?.men ?? 0, label: "men's" },
                { value: stats.genderCounts?.women ?? 0, label: "women's" },
                { value: stats.genderCounts?.unisex ?? 0, label: 'unisex' },
            ]}
        />
    );
};

export default AccordPage;

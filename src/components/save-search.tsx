'use client';

import { useEffect } from 'react';

const SaveSearch = ({
    query,
    hasResults,
}: {
    query: string;
    hasResults: boolean;
}) => {
    useEffect(() => {
        if (!hasResults || !query) return;
        fetch('/api/search/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
    }, [query, hasResults]);

    return null;
};

export default SaveSearch;

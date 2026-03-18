'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const RemoveButton = ({
    titleId,
    listType,
    onRemove,
}: {
    titleId: number;
    listType: string;
    onRemove: (titleId: number) => void;
}) => {
    const [loading, setLoading] = useState(false);

    const remove = async () => {
        setLoading(true);

        const res = await fetch('/api/watchlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titleId, listType }),
        });

        if (res.ok) onRemove(titleId);
        setLoading(false);
    };

    return (
        <Button
            variant='ghost'
            size='sm'
            onClick={remove}
            disabled={loading}
            className='text-xs px-3 py-1.5 rounded-md border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors disabled:opacity-50'
        >
            {loading ? '...' : 'Remove'}
        </Button>
    );
};

export default RemoveButton;

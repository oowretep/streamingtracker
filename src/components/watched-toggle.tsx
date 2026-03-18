'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface WatchedToggleProps {
    titleId: number;
    listType: string;
    watched: boolean;
}

const WatchedToggle = ({
    titleId,
    listType,
    watched: initialWatched,
}: WatchedToggleProps) => {
    const [watched, setWatched] = useState(initialWatched);
    const [loading, setLoading] = useState(false);

    const toggle = async () => {
        setLoading(true);

        const res = await fetch('/api/watchlist/watched', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titleId, listType, watched: !watched }),
        });

        if (res.ok) setWatched(!watched);
        setLoading(false);
    };

    return (
        <div className='flex items-center gap-2'>
            <Badge variant={watched ? 'default' : 'secondary'}>
                {watched ? 'Watched' : 'Unwatched'}
            </Badge>
            <Button
                variant='outline'
                size='sm'
                onClick={toggle}
                disabled={loading}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors disabled:opacity-50 ${
                    watched
                        ? 'border-border hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950 dark:hover:text-red-400'
                        : 'border-border hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400'
                }`}
            >
                {loading ? '...' : watched ? 'Mark Unwatched' : 'Mark Watched'}
            </Button>
        </div>
    );
};

export default WatchedToggle;

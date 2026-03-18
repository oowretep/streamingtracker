'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

interface WatchlistButtonsProps {
    titleId: number;
    titleName: string;
    titleYear: number;
    titleType: string;
    poster: string;
    initialWatchlist: boolean;
    initialFavorite: boolean;
}

const WatchlistButtons = ({
    titleId,
    titleName,
    titleYear,
    titleType,
    poster,
    initialWatchlist,
    initialFavorite,
}: WatchlistButtonsProps) => {
    const { data: session } = useSession();
    const [inWatchlist, setInWatchlist] = useState(initialWatchlist);
    const [inFavorites, setInFavorites] = useState(initialFavorite);
    const [loading, setLoading] = useState<string | null>(null);

    if (!session) {
        return (
            <p className='text-sm text-muted-foreground'>
                Sign in to save titles to your lists
            </p>
        );
    }

    const toggle = async (listType: 'watchlist' | 'favorites') => {
        const isIn = listType === 'watchlist' ? inWatchlist : inFavorites;
        const setIn =
            listType === 'watchlist' ? setInWatchlist : setInFavorites;

        setLoading(listType);

        if (isIn) {
            const res = await fetch('/api/watchlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titleId,
                    listType,
                }),
            });

            if (res.ok) setIn(false);
        } else {
            const res = await fetch('/api/watchlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titleId,
                    titleName,
                    titleYear,
                    titleType,
                    poster,
                    listType,
                }),
            });

            if (res.ok) setIn(true);
        }

        setLoading(null);
    };

    return (
        <div className='flex gap-2'>
            <Button
                variant={inWatchlist ? 'default' : 'outline'}
                onClick={() => toggle('watchlist')}
                disabled={loading !== null}
                className={
                    inWatchlist
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                        : 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-300'
                }
            >
                {loading === 'watchlist'
                    ? 'Saving...'
                    : inWatchlist
                      ? '✓ In Watchlist'
                      : '+ Watchlist'}
            </Button>
            <Button
                variant={inFavorites ? 'default' : 'outline'}
                onClick={() => toggle('favorites')}
                disabled={loading !== null}
                className={
                    inFavorites
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                        : 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-950 dark:hover:text-amber-300'
                }
            >
                {loading === 'favorites'
                    ? 'Saving...'
                    : inFavorites
                      ? '✓ Favorited'
                      : '+ Favorites'}
            </Button>
        </div>
    );
};

export default WatchlistButtons;

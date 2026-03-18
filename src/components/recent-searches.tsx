'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

interface SearchHistoryItem {
    id: string;
    query: string;
}

const RecentSearches = () => {
    const { data: session } = useSession();
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!session) return;

        fetch('/api/search/history')
            .then((res) => res.json())
            .then(setHistory);
    }, [session]);

    if (!session) {
        return (
            <div className='mt-10'>
                <p className='text-sm text-muted-foreground mt-4'>
                    Sign in to see your recent searches.
                </p>
            </div>
        );
    }

    if (history.length === 0) return null;

    return (
        <div className='mt-10'>
            <p className='text-xs text-muted-foreground mb-2'>
                Recent searches
            </p>
            <div className='flex flex-wrap gap-2'>
                {history.map((item) => (
                    <button
                        key={item.id}
                        onClick={() =>
                            router.push(
                                `/search?q=${encodeURIComponent(item.query)}`,
                            )
                        }
                        className='cursor-pointer text-sm px-3 py-1 rounded-full border border-border hover:bg-accent transition-colors'
                    >
                        {item.query}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RecentSearches;

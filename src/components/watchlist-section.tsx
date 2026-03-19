'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WatchedToggle from '@/components/watched-toggle';
import RemoveButton from '@/components/remove-button';
import { Badge } from '@/components/ui/badge';
import { formatType } from '@/lib/watchmode';

interface WatchlistItem {
    id: string;
    titleId: number;
    titleName: string;
    titleYear: number | null;
    titleType: string | null;
    poster: string | null;
    listType: string;
    watched: boolean;
    sources: string | null;
}

interface WatchlistSectionProps {
    title: string;
    items: WatchlistItem[];
}

const WatchlistSection = ({
    title,
    items: initialItems,
}: WatchlistSectionProps) => {
    const [items, setItems] = useState(initialItems);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const removeItem = (titleId: number) => {
        setItems((prev) => prev.filter((item) => item.titleId !== titleId));
    };

    // build platform counts from all items
    const platformCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const item of items) {
            if (!item.sources) continue;
            const sources: string[] = JSON.parse(item.sources);
            for (const source of sources) {
                counts[source] = (counts[source] ?? 0) + 1;
            }
        }
        return counts;
    }, [items]);

    const platforms = Object.entries(platformCounts).sort(
        (a, b) => b[1] - a[1],
    );

    const filteredItems = useMemo(() => {
        if (!activeFilter) return items;
        return items.filter((item) => {
            if (!item.sources) return false;
            const sources: string[] = JSON.parse(item.sources);
            return sources.includes(activeFilter);
        });
    }, [items, activeFilter]);

    return (
        <section className='mb-12'>
            <div className='flex items-center gap-2 mb-4'>
                <h2 className='text-xl font-medium'>{title}</h2>
                <Badge variant='secondary'>{items.length}</Badge>
            </div>

            {platforms.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-4'>
                    <button
                        onClick={() => setActiveFilter(null)}
                        className={`cursor-pointer text-xs px-3 py-1 rounded-full border transition-colors ${
                            activeFilter === null
                                ? 'bg-foreground text-primary-foreground border-foreground'
                                : 'border-border hover:bg-accent'
                        }`}
                    >
                        All
                    </button>
                    {platforms.map(([platform, count]) => (
                        <button
                            key={platform}
                            onClick={() =>
                                setActiveFilter(
                                    platform === activeFilter ? null : platform,
                                )
                            }
                            className={`cursor-pointer text-xs px-3 py-1 rounded-full border transition-colors ${
                                activeFilter === platform
                                    ? 'bg-foreground text-primary-foreground border-foreground'
                                    : 'border-border hover:bg-accent'
                            }`}
                        >
                            {platform} · {count}
                        </button>
                    ))}
                </div>
            )}

            {filteredItems.length === 0 ? (
                <p className='text-muted-foreground'>Nothing here yet.</p>
            ) : (
                <div className='flex flex-col gap-3'>
                    {filteredItems.map((item) => (
                        <div
                            className='flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-border shadow-sm hover:shadow-md transition-all'
                            key={item.id}
                        >
                            <Link
                                href={`/title/${item.titleId}?from=list`}
                                className='flex items-center gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity'
                            >
                                {item.poster ? (
                                    <Image
                                        src={item.poster}
                                        alt={item.titleName}
                                        width={48}
                                        height={72}
                                        className='rounded object-cover shrink-0'
                                    />
                                ) : (
                                    <div className='w-12 h-18 bg-muted rounded shrink-0' />
                                )}
                                <div className='flex-1 min-w-0'>
                                    <p className='font-medium'>
                                        {item.titleName}
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                        {item.titleYear} ·{' '}
                                        {item.titleType
                                            ? formatType(item.titleType)
                                            : ''}
                                    </p>
                                    {item.sources && (
                                        <p className='text-xs text-muted-foreground mt-1'>
                                            {(
                                                JSON.parse(
                                                    item.sources,
                                                ) as string[]
                                            ).join(' · ')}
                                        </p>
                                    )}
                                </div>
                            </Link>
                            <div className='flex items-center gap-2 shrink-0'>
                                <WatchedToggle
                                    titleId={item.titleId}
                                    listType={item.listType}
                                    watched={item.watched}
                                />
                                <RemoveButton
                                    titleId={item.titleId}
                                    listType={item.listType}
                                    onRemove={removeItem}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default WatchlistSection;

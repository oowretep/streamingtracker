'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatType, getTypeBadgeClass } from '@/lib/watchmode';

interface TitleResult {
    id: number;
    name: string;
    type: string;
    year: number;
    poster: string | null;
}

interface SearchResultsProps {
    results: TitleResult[];
    query: string;
}

const DECADES = ['2020s', '2010s', '2000s', '1990s', '1980s', 'Older'];

const getDecade = (year: number): string => {
    if (year >= 2020) return '2020s';
    if (year >= 2010) return '2010s';
    if (year >= 2000) return '2000s';
    if (year >= 1990) return '1990s';
    if (year >= 1980) return '1980s';
    return 'Older';
};

const getTypeGroup = (type: string): string => {
    if (['movie', 'short_film', 'tv_movie'].includes(type)) return 'movie';
    return 'tv';
};

const FilterPill = ({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`cursor-pointer text-xs px-3 py-1 rounded-full border transition-colors ${
            active
                ? 'bg-foreground text-primary-foreground border-foreground'
                : 'border-border hover:bg-accent'
        }`}
    >
        {label}
    </button>
);

const SearchResults = ({ results, query }: SearchResultsProps) => {
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [decadeFilter, setDecadeFilter] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    const sorted = useMemo(() => {
        return [...results].sort((a, b) => {
            const aExact = a.name.toLowerCase() === query.toLowerCase() ? 1 : 0;
            const bExact = b.name.toLowerCase() === query.toLowerCase() ? 1 : 0;
            if (aExact !== bExact) return bExact - aExact;
            return b.year - a.year;
        });
    }, [results, query]);

    const availableDecades = useMemo(() => {
        const decades = new Set(sorted.map((r) => getDecade(r.year)));
        return DECADES.filter((d) => decades.has(d));
    }, [sorted]);

    const filtered = useMemo(() => {
        return sorted.filter((r) => {
            if (typeFilter && getTypeGroup(r.type) !== typeFilter) return false;
            if (decadeFilter && getDecade(r.year) !== decadeFilter)
                return false;
            return true;
        });
    }, [sorted, typeFilter, decadeFilter]);

    const displayed = showAll ? filtered : filtered.slice(0, 10);
    const hasMore = filtered.length > 10;
    const hasFilters = availableDecades.length > 1;

    return (
        <div>
            {hasFilters && (
                <div className='flex flex-col gap-3 mb-6'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='text-xs text-muted-foreground'>
                            Type
                        </span>
                        <FilterPill
                            label='All'
                            active={typeFilter === null}
                            onClick={() => setTypeFilter(null)}
                        />
                        <FilterPill
                            label='Movies'
                            active={typeFilter === 'movie'}
                            onClick={() =>
                                setTypeFilter(
                                    typeFilter === 'movie' ? null : 'movie',
                                )
                            }
                        />
                        <FilterPill
                            label='TV'
                            active={typeFilter === 'tv'}
                            onClick={() =>
                                setTypeFilter(typeFilter === 'tv' ? null : 'tv')
                            }
                        />
                    </div>
                    {availableDecades.length > 1 && (
                        <div className='flex flex-wrap items-center gap-2'>
                            <span className='text-xs text-muted-foreground'>
                                Decade
                            </span>
                            <FilterPill
                                label='All'
                                active={decadeFilter === null}
                                onClick={() => setDecadeFilter(null)}
                            />
                            {availableDecades.map((decade) => (
                                <FilterPill
                                    key={decade}
                                    label={decade}
                                    active={decadeFilter === decade}
                                    onClick={() =>
                                        setDecadeFilter(
                                            decadeFilter === decade
                                                ? null
                                                : decade,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <p className='text-sm text-muted-foreground mb-4'>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>

            {displayed.length === 0 ? (
                <p className='text-muted-foreground'>
                    No results match your filters.
                </p>
            ) : (
                <>
                    <div className='flex flex-col gap-2'>
                        {displayed.map((title) => (
                            <Link key={title.id} href={`/title/${title.id}`}>
                                <div className='flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent hover:shadow-md transition-all cursor-pointer shadow-sm'>
                                    <div className='shrink-0 w-12 h-16 rounded-lg overflow-hidden bg-muted'>
                                        {title.poster ? (
                                            <Image
                                                src={title.poster}
                                                alt={title.name}
                                                width={48}
                                                height={64}
                                                className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
                                            />
                                        ) : (
                                            <div className='w-full h-full bg-muted flex items-center justify-center'>
                                                <span className='text-muted-foreground text-xs'>
                                                    ?
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium group-hover:text-foreground transition-colors'>
                                            {title.name}
                                        </p>
                                        <p className='text-sm text-muted-foreground'>
                                            {title.year}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${getTypeBadgeClass(title.type)}`}
                                    >
                                        {formatType(title.type)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {hasMore && !showAll && (
                        <button
                            onClick={() => setShowAll(true)}
                            className='mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center py-2 border border-dashed border-border rounded-lg hover:border-border/80'
                        >
                            Show all {filtered.length} results
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResults;

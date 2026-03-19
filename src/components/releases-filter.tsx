'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatType, getTypeBadgeClass } from '@/lib/watchmode';

interface Release {
    id: number;
    title: string;
    type: string;
    source_id: number;
    source_name: string;
    source_release_date: string;
    season_number: number | null;
    is_original: number;
    poster: string | null;
    isUpcoming: boolean;
    tmdb_id: number;
}

interface Platform {
    id: number;
    name: string;
}

interface ReleasesFilterProps {
    newReleases: Release[];
    upcoming: Release[];
    platforms: Platform[];
}

const PAGE_SIZE = 10;

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

const ReleaseCard = ({ release }: { release: Release }) => {
    const date = new Date(
        release.source_release_date.replace(
            /(\d{4})(\d{2})(\d{2})/,
            '$1-$2-$3',
        ),
    ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <Link href={`/title/${release.id}?from=releases`}>
            <div className='flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent hover:shadow-md transition-all cursor-pointer shadow-sm'>
                <div className='shrink-0 w-12 h-16 rounded overflow-hidden bg-muted'>
                    {release.poster ? (
                        <Image
                            src={release.poster}
                            alt={release.title}
                            width={48}
                            height={64}
                            className='object-cover w-full h-full'
                        />
                    ) : (
                        <div className='w-full h-full bg-muted' />
                    )}
                </div>
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                        <p className='font-medium'>{release.title}</p>
                        {release.is_original === 1 && (
                            <span className='text-xs px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'>
                                Original
                            </span>
                        )}
                        {release.isUpcoming && (
                            <span className='text-xs px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'>
                                Coming Soon
                            </span>
                        )}
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        {release.source_name}
                        {release.season_number
                            ? ` · Season ${release.season_number}`
                            : ''}
                        {' · '}
                        {date}
                    </p>
                </div>
                <span
                    className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${getTypeBadgeClass(release.type)}`}
                >
                    {formatType(release.type)}
                </span>
            </div>
        </Link>
    );
};

const PaginatedSection = ({
    title,
    releases,
    page,
    onPageChange,
}: {
    title: string;
    releases: Release[];
    page: number;
    onPageChange: (page: number) => void;
}) => {
    const totalPages = Math.ceil(releases.length / PAGE_SIZE);
    const paged = releases.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <section className='mb-10'>
            <h2 className='text-xl font-medium mb-4'>
                {title}
                <span className='text-sm font-normal text-muted-foreground ml-2'>
                    {releases.length} titles
                </span>
            </h2>
            {releases.length === 0 ? (
                <p className='text-muted-foreground'>
                    No releases match your filters.
                </p>
            ) : (
                <>
                    <div className='flex flex-col gap-3'>
                        {paged.map((r) => (
                            <ReleaseCard key={r.id} release={r} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className='flex items-center justify-between mt-4'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => onPageChange(page - 1)}
                                disabled={page === 0}
                                className='cursor-pointer'
                            >
                                ← Previous
                            </Button>
                            <span className='text-sm text-muted-foreground'>
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => onPageChange(page + 1)}
                                disabled={page === totalPages - 1}
                                className='cursor-pointer'
                            >
                                Next →
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

const ReleasesFilter = ({
    newReleases,
    upcoming,
    platforms,
}: ReleasesFilterProps) => {
    const [platformFilter, setPlatformFilter] = useState<number | null>(null);
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [newPage, setNewPage] = useState(0);
    const [upcomingPage, setUpcomingPage] = useState(0);

    const handlePlatformFilter = (id: number | null) => {
        setPlatformFilter(id);
        setNewPage(0);
        setUpcomingPage(0);
    };

    const handleTypeFilter = (type: string | null) => {
        setTypeFilter(type);
        setNewPage(0);
        setUpcomingPage(0);
    };

    const availablePlatforms = useMemo(() => {
        const all = [...newReleases, ...upcoming];
        const ids = new Set(all.map((r) => r.source_id));
        return platforms.filter((p) => ids.has(p.id));
    }, [newReleases, upcoming, platforms]);

    const filteredNew = useMemo(() => {
        return newReleases.filter((r) => {
            if (platformFilter && r.source_id !== platformFilter) return false;
            if (typeFilter) {
                const group = [
                    'movie',
                    'short_film',
                    'tv_movie',
                    'tv_special',
                ].includes(r.type)
                    ? 'movie'
                    : 'tv';
                if (group !== typeFilter) return false;
            }
            return true;
        });
    }, [newReleases, platformFilter, typeFilter]);

    const filteredUpcoming = useMemo(() => {
        return upcoming.filter((r) => {
            if (platformFilter && r.source_id !== platformFilter) return false;
            if (typeFilter) {
                const group = [
                    'movie',
                    'short_film',
                    'tv_movie',
                    'tv_special',
                ].includes(r.type)
                    ? 'movie'
                    : 'tv';
                if (group !== typeFilter) return false;
            }
            return true;
        });
    }, [upcoming, platformFilter, typeFilter]);

    return (
        <div>
            <div className='flex flex-col gap-3 mb-8'>
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>
                        Platform
                    </span>
                    <FilterPill
                        label='All'
                        active={platformFilter === null}
                        onClick={() => handlePlatformFilter(null)}
                    />
                    {availablePlatforms.map((p) => (
                        <FilterPill
                            key={p.id}
                            label={p.name}
                            active={platformFilter === p.id}
                            onClick={() =>
                                handlePlatformFilter(
                                    platformFilter === p.id ? null : p.id,
                                )
                            }
                        />
                    ))}
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>Type</span>
                    <FilterPill
                        label='All'
                        active={typeFilter === null}
                        onClick={() => handleTypeFilter(null)}
                    />
                    <FilterPill
                        label='Movies'
                        active={typeFilter === 'movie'}
                        onClick={() =>
                            handleTypeFilter(
                                typeFilter === 'movie' ? null : 'movie',
                            )
                        }
                    />
                    <FilterPill
                        label='TV'
                        active={typeFilter === 'tv'}
                        onClick={() =>
                            handleTypeFilter(typeFilter === 'tv' ? null : 'tv')
                        }
                    />
                </div>
            </div>

            <PaginatedSection
                title='New Additions'
                releases={filteredNew}
                page={newPage}
                onPageChange={setNewPage}
            />
            <PaginatedSection
                title='Upcoming'
                releases={filteredUpcoming}
                page={upcomingPage}
                onPageChange={setUpcomingPage}
            />
        </div>
    );
};

export default ReleasesFilter;

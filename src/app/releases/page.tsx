import Link from 'next/link';
import ReleasesFilter from '@/components/releases-filter';
import { STREAMING_PLATFORMS } from '@/lib/watchmode';

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

const ReleasesPage = async () => {
    const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/releases`, {
        cache: 'no-store',
    });

    const data = await res.json();
    const releases: Release[] = data.releases ?? [];

    const newReleases = releases.filter((r) => !r.isUpcoming);
    const upcoming = releases.filter((r) => r.isUpcoming);

    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            <Link
                href='/'
                className='text-sm text-muted-foreground hover:text-foreground mb-6 inline-block'
            >
                ← Back to search
            </Link>
            <h1 className='text-3xl font-medium mb-2'>New & Upcoming</h1>
            <p className='text-muted-foreground mb-8'>
                Recent additions and upcoming releases across streaming
                platforms.
            </p>
            <ReleasesFilter
                newReleases={newReleases}
                upcoming={upcoming}
                platforms={STREAMING_PLATFORMS}
            />
        </main>
    );
};

export const metadata = {
    title: 'New & Upcoming',
};

export default ReleasesPage;

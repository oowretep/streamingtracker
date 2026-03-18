import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';

interface Release {
    id: number;
    title: string;
    type: string;
    source_name: string;
    poster: string | null;
    isUpcoming: boolean;
}

const HomepageReleases = async () => {
    const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/releases`, {
        cache: 'no-store',
    });

    const data = await res.json();
    const releases: Release[] = data.releases ?? [];

    // pick 4 random ones with poster
    const withPosters = releases.filter((r) => r.poster).slice(0, 4);

    if (withPosters.length === 0) return null;

    return (
        <div className='mt-10'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-medium'>New & Upcoming</h2>
                <Link
                    href='/releases/'
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                >
                    View all →
                </Link>
            </div>

            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                {withPosters.map((r) => (
                    <Link key={r.id} href={`/title/${r.id}`}>
                        <div className='rounded-lg overflow-hidden border border-border hover:shadow-md transition-all shadow-sm'>
                            <div className='aspect-2/3 relative bg-muted'>
                                {r.poster && (
                                    <Image
                                        src={r.poster}
                                        alt={r.title}
                                        fill
                                        className='object-cover'
                                    />
                                )}
                            </div>

                            <div className='p-2'>
                                <p className='text-xs font-medium truncate'>
                                    {r.title}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    {r.source_name}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomepageReleases;

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { watchlist } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';

const ProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect('/');

    const [watchlistItems, favoriteItems] = await Promise.all([
        db
            .select()
            .from(watchlist)
            .where(
                and(
                    eq(watchlist.userId, session.user.id),
                    eq(watchlist.listType, 'watchlist'),
                ),
            ),
        db
            .select()
            .from(watchlist)
            .where(
                and(
                    eq(watchlist.userId, session.user.id),
                    eq(watchlist.listType, 'favorites'),
                ),
            ),
    ]);

    const watchedCount = [...watchlistItems, ...favoriteItems].filter(
        (i) => i.watched,
    ).length;
    const unwatchedCount = [...watchlistItems, ...favoriteItems].filter(
        (i) => !i.watched,
    ).length;

    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            <div className='flex items-center gap-4 mb-10'>
                {session.user.image && (
                    <Image
                        src={session.user.image}
                        alt={session.user.name ?? 'Profile'}
                        width={64}
                        height={64}
                        className='rounded-full'
                    />
                )}

                <div>
                    <h1 className='text-2xl font-medium'>
                        {session.user.name}
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        {session.user.email}
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4 mb-10 sm:grid-cols-4'>
                <StatCard label='Watchlist' value={watchlistItems.length} />
                <StatCard label='Favorites' value={favoriteItems.length} />
                <StatCard label='Watched' value={watchedCount} />
                <StatCard label='Unwatched' value={unwatchedCount} />
            </div>
        </main>
    );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
    <div
        className='border border-border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all'
        style={{ background: 'var(--accent-gradient)' }}
    >
        <p className='text-3xl font-medium'>{value}</p>
        <p className='text-sm text-muted-foreground mt-1'>{label}</p>
    </div>
);

export const metadata = {
    title: 'Profile',
};

export default ProfilePage;

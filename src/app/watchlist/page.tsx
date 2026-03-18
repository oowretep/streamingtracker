import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { watchlist } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import WatchlistSection from '@/components/watchlist-section';

const WatchlistPage = async () => {
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

    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            <Link
                href='/'
                className='text-sm text-muted-foreground hover:text-foreground mb-8 inline-block transition-colors'
            >
                ← Back to search
            </Link>
            <h1 className='text-3xl font-medium tracking-tight mb-10'>
                My Lists
            </h1>
            <WatchlistSection title='Watchlist' items={watchlistItems} />
            <WatchlistSection title='Favorites' items={favoriteItems} />
        </main>
    );
};

export const metadata = {
    title: 'My Lists',
};

export default WatchlistPage;

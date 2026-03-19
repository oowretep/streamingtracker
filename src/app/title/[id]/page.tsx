import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/star-rating';
import { GENRES, formatType } from '@/lib/watchmode';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { watchlist } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import WatchlistButtons from '@/components/watchlist-buttons';

interface Source {
    source_id: number;
    name: string;
    type: string;
    region: string;
    web_url: string;
    format: string;
    price: number;
    seasons: number;
    episodes: number;
}

interface TitleDetails {
    id: number;
    title: string;
    year: number;
    type: string;
    plot_overview: string;
    user_rating: number;
    poster: string;
    genres: number[];
}

interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

interface TitleDetails {
    id: number;
    title: string;
    year: number;
    type: string;
    plot_overview: string;
    user_rating: number;
    poster: string;
    genres: number[];
    runtime_minutes: number | null;
    us_rating: string | null;
    director: string | null;
    cast: CastMember[];
}

interface TitlePageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ from?: string; q?: string }>;
}

const QUALITY_RANK: Record<string, number> = {
    '4k': 3,
    hd: 2,
    sd: 1,
};

const deduplicateSources = (sources: Source[]): Source[] => {
    const map = new Map<string, Source>();
    for (const source of sources) {
        const key = `${source.name}-${source.type}-${source.price}`;
        const existing = map.get(key);
        if (!existing) {
            map.set(key, source);
        } else {
            const currentRank = QUALITY_RANK[source.format?.toLowerCase()] ?? 0;
            const existingRank =
                QUALITY_RANK[existing.format?.toLowerCase()] ?? 0;
            if (currentRank > existingRank) {
                map.set(key, source);
            }
        }
    }
    return Array.from(map.values());
};

const SourcePill = ({
    source,
    releaseDate,
}: {
    source: Source;
    releaseDate?: string;
}) => {
    const isRentOrBuy = source.type === 'rent' || source.type === 'buy';
    const showPrice = isRentOrBuy && source.price > 0;
    const showFormat = isRentOrBuy && source.format;
    const showSeasons = source.seasons > 0;
    const showEpisodes = source.episodes > 0;

    const formattedDate = releaseDate
        ? new Date(
              releaseDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'),
          ).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : null;

    return (
        <a
            href={releaseDate ? undefined : source.web_url}
            target={releaseDate ? undefined : '_blank'}
            rel='noopener noreferrer'
            className={`flex flex-col px-4 py-2 rounded-full border text-sm font-medium text-center transition-colors ${
                releaseDate
                    ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 cursor-default'
                    : 'border-border hover:bg-accent'
            }`}
        >
            <span>{source.name}</span>
            {releaseDate ? (
                <span className='text-xs font-normal'>
                    Coming {formattedDate}
                </span>
            ) : (
                <span className='text-xs text-muted-foreground font-normal'>
                    {[
                        showFormat && source.format,
                        showPrice && `$${source.price.toFixed(2)}`,
                        showSeasons &&
                            `${source.seasons} season${source.seasons > 1 ? 's' : ''}`,
                        showEpisodes &&
                            `${source.episodes} ep${source.episodes > 1 ? 's' : ''}`,
                    ]
                        .filter(Boolean)
                        .join(' · ')}
                </span>
            )}
        </a>
    );
};

const SourceSection = ({
    title,
    sources,
    upcomingMap,
}: {
    title: string;
    sources: Source[];
    upcomingMap: Map<number, string>;
}) => {
    if (sources.length === 0) return null;

    return (
        <div className='mb-6'>
            <h3 className='text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3'>
                {title}
            </h3>
            <div className='flex flex-wrap gap-2'>
                {sources.map((source) => (
                    <SourcePill
                        key={`${source.source_id}-${source.format}`}
                        source={source}
                        releaseDate={upcomingMap.get(source.source_id)}
                    />
                ))}
            </div>
        </div>
    );
};

const TitlePage = async ({ params, searchParams }: TitlePageProps) => {
    const { id } = await params;
    const { from, q } = await searchParams;

    const [detailsRes, sourcesRes, upcomingRes] = await Promise.all([
        fetch(`${process.env.BETTER_AUTH_URL}/api/title/${id}/details`, {
            cache: 'no-store',
        }),
        fetch(`${process.env.BETTER_AUTH_URL}/api/title/${id}/sources`, {
            cache: 'no-store',
        }),
        fetch(`${process.env.BETTER_AUTH_URL}/api/title/${id}/upcoming`, {
            cache: 'no-store',
        }),
    ]);

    const details: TitleDetails = await detailsRes.json();
    const sources: Source[] = await sourcesRes.json();
    const upcomingReleases: {
        source_id: number;
        source_name: string;
        source_release_date: string;
    }[] = await upcomingRes.json();

    const upcomingMap = new Map(
        upcomingReleases.map((r) => [r.source_id, r.source_release_date]),
    );

    const session = await auth.api.getSession({ headers: await headers() });

    let inWatchlist = false;
    let inFavorites = false;

    if (session) {
        const [watchlistEntry, favoritesEntry] = await Promise.all([
            db
                .select()
                .from(watchlist)
                .where(
                    and(
                        eq(watchlist.userId, session.user.id),
                        eq(watchlist.titleId, Number(id)),
                        eq(watchlist.listType, 'watchlist'),
                    ),
                ),
            db
                .select()
                .from(watchlist)
                .where(
                    and(
                        eq(watchlist.userId, session.user.id),
                        eq(watchlist.titleId, Number(id)),
                        eq(watchlist.listType, 'favorites'),
                    ),
                ),
        ]);
        inWatchlist = watchlistEntry.length > 0;
        inFavorites = favoritesEntry.length > 0;
    }

    const usSources = deduplicateSources(
        sources.filter((s) => s.region === 'US'),
    );
    const subSources = usSources.filter((s) => s.type === 'sub');
    const rentSources = usSources.filter((s) => s.type === 'rent');
    const buySources = usSources.filter((s) => s.type === 'buy');

    const genreNames =
        details.genres?.map((id: number) => GENRES[id]).filter(Boolean) ?? [];

    return (
        <main className='max-w-3xl mx-auto px-4 py-12'>
            {from === 'list' ? (
                <Link
                    href='/watchlist'
                    className='text-sm text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1 transition-colors'
                >
                    ← Back
                </Link>
            ) : from === 'search' && q ? (
                <Link
                    href={`/search?q=${encodeURIComponent(q)}`}
                    className='text-sm text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1 transition-colors'
                >
                    ← Back
                </Link>
            ) : (
                <Link
                    href='/'
                    className='text-sm text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1 transition-colors'
                >
                    ← Back
                </Link>
            )}

            <div
                className='rounded-xl p-6 mb-6 border border-border shadow-sm'
                style={{ background: 'var(--accent-gradient)' }}
            >
                <div className='flex flex-col sm:flex-row gap-6'>
                    {details.poster && (
                        <Image
                            src={details.poster}
                            alt={details.title}
                            width={128}
                            height={192}
                            className='rounded-lg object-cover sm:shrink-0 w-32 mx-auto sm:mx-0'
                        />
                    )}
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-3xl font-medium'>
                            {details.title}
                        </h1>
                        <p className='text-muted-foreground'>
                            {details.year} · {formatType(details.type)}
                        </p>
                        <div className='flex gap-2 flex-wrap'>
                            {genreNames.map((genre) => (
                                <Badge key={genre} variant='secondary'>
                                    {genre}
                                </Badge>
                            ))}
                        </div>
                        {details.user_rating && (
                            <StarRating rating={details.user_rating} />
                        )}
                        <WatchlistButtons
                            titleId={details.id}
                            titleName={details.title}
                            titleYear={details.year}
                            titleType={details.type}
                            poster={details.poster ?? ''}
                            initialWatchlist={inWatchlist}
                            initialFavorite={inFavorites}
                        />
                    </div>
                </div>
            </div>

            {details.plot_overview && (
                <p className='text-muted-foreground leading-relaxed mb-8 text-base'>
                    {details.plot_overview}
                </p>
            )}

            {/* Runtime and rating */}
            <div className='flex gap-4 text-sm text-muted-foreground mb-6'>
                {details.runtime_minutes && (
                    <span>
                        {Math.floor(details.runtime_minutes / 60)}h{' '}
                        {details.runtime_minutes % 60}m
                    </span>
                )}
                {details.us_rating && (
                    <span className='px-2 py-0.5 border border-border rounded text-xs'>
                        {details.us_rating}
                    </span>
                )}
                {details.director && (
                    <span>
                        Directed by{' '}
                        <span className='text-foreground font-medium'>
                            {details.director}
                        </span>
                    </span>
                )}
            </div>

            {/* Cast */}
            {details.cast && details.cast.length > 0 && (
                <div className='mb-8'>
                    <h2 className='text-xl font-medium mb-4'>Cast</h2>
                    <div className='flex gap-3 overflow-x-auto pb-2'>
                        {details.cast.map((member) => (
                            <div
                                key={member.id}
                                className='flex flex-col items-center gap-2 shrink-0 w-20'
                            >
                                <div className='w-16 h-16 rounded-full overflow-hidden bg-muted border border-border'>
                                    {member.profile_path ? (
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                                            alt={member.name}
                                            width={64}
                                            height={64}
                                            className='object-cover w-full h-full'
                                        />
                                    ) : (
                                        <div className='w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs'>
                                            ?
                                        </div>
                                    )}
                                </div>
                                <div className='text-center'>
                                    <p className='text-xs font-medium leading-tight'>
                                        {member.name}
                                    </p>
                                    <p className='text-xs text-muted-foreground leading-tight'>
                                        {member.character}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className='border-t border-border pt-8'>
                <h2 className='text-lg font-medium mb-6'>Where to watch</h2>
                {usSources.length === 0 ? (
                    <p className='text-muted-foreground'>
                        Not available on any streaming platforms.
                    </p>
                ) : (
                    <>
                        <SourceSection
                            title='Stream'
                            sources={subSources}
                            upcomingMap={upcomingMap}
                        />
                        <SourceSection
                            title='Rent'
                            sources={rentSources}
                            upcomingMap={upcomingMap}
                        />
                        <SourceSection
                            title='Buy'
                            sources={buySources}
                            upcomingMap={upcomingMap}
                        />
                    </>
                )}
            </div>
        </main>
    );
};

export default TitlePage;

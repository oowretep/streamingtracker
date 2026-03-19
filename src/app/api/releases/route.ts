import { NextRequest, NextResponse } from 'next/server';
import watchmode from '@/lib/watchmode';
import { STREAMING_PLATFORMS } from '@/lib/watchmode';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w185';
const TMDB_KEY = process.env.TMDB_API_KEY;

const fetchPoster = async (
    tmdbId: number,
    tmdbType: string,
): Promise<string | null> => {
    if (!tmdbId) return null;

    const type = tmdbType === 'movie' ? 'movie' : 'tv';

    const res = await fetch(
        `${TMDB_BASE}/${type}/${tmdbId}?api_key=${TMDB_KEY}`,
        { next: { revalidate: 86400 } }, // cache for 24 hours
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.poster_path ? `${TMDB_IMG}${data.poster_path}` : null;
};

export const GET = async (req: NextRequest) => {
    const sourceId = req.nextUrl.searchParams.get('source_id');
    const sourceIds = sourceId
        ? sourceId
        : STREAMING_PLATFORMS.map((p) => p.id).join(',');

    try {
        const data = await watchmode.getReleases(sourceIds);
        const releases = data.releases ?? [];

        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

        console.log('today:', today);
        console.log(
            'release dates:',
            releases.map(
                (r: { source_release_date: string; title: string }) => ({
                    title: r.title,
                    date: r.source_release_date,
                }),
            ),
        );

        const withPosters = await Promise.all(
            releases.map(
                async (r: {
                    id: number;
                    title: string;
                    type: string;
                    source_id: number;
                    source_name: string;
                    source_release_date: string;
                    season_number: number | null;
                    is_original: number;
                    tmdb_id: number;
                    tmdb_type: string;
                }) => {
                    const poster = await fetchPoster(r.tmdb_id, r.tmdb_type);
                    const isUpcoming =
                        r.source_release_date.replace(/-/g, '') > today;

                    return { ...r, poster, isUpcoming };
                },
            ),
        );

        return NextResponse.json({ releases: withPosters });
    } catch (error) {
        console.log('Releases error: ', error);
        return NextResponse.json(
            { error: 'Failed to fetch releases' },
            { status: 500 },
        );
    }
};

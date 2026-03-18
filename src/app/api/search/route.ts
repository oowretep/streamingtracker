import { NextRequest, NextResponse } from 'next/server';
import watchmode from '@/lib/watchmode';

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
        `${TMDB_BASE}/${type}/${tmdbId}?api_key=${TMDB_KEY}&append_to_response=images`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.poster_path ? `${TMDB_IMG}${data.poster_path}` : null;
};

export const GET = async (req: NextRequest) => {
    const query = req.nextUrl.searchParams.get('q');

    if (!query) {
        return NextResponse.json(
            { error: 'No query provided' },
            { status: 400 },
        );
    }

    try {
        const results = await watchmode.search(query);
        const titles = results.title_results ?? [];

        const titlesWithPosters = await Promise.all(
            titles.map(
                async (title: {
                    id: number;
                    name: string;
                    type: string;
                    year: number;
                    tmdb_id: number;
                    tmdb_type: string;
                }) => {
                    const poster = await fetchPoster(
                        title.tmdb_id,
                        title.tmdb_type,
                    );
                    return { ...title, poster };
                },
            ),
        );

        return NextResponse.json({ title_results: titlesWithPosters });
    } catch (error) {
        console.log('Search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
};

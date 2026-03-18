import { NextRequest, NextResponse } from 'next/server';
import watchmode from '@/lib/watchmode';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    const { id } = await params;
    try {
        const data = await watchmode.getTitle(id);

        // fetch cast from TMDB
        if (data.tmdb_id && data.tmdb_type) {
            const type = data.tmdb_type === 'movie' ? 'movie' : 'tv';
            const creditsRes = await fetch(
                `${TMDB_BASE}/${type}/${data.tmdb_id}/credits?api_key=${TMDB_KEY}`,
            );
            if (creditsRes.ok) {
                const credits = await creditsRes.json();
                data.cast = credits.cast?.slice(0, 8) ?? [];
                data.crew = credits.crew ?? [];
                data.director =
                    credits.crew?.find(
                        (c: { job: string; name: string }) =>
                            c.job === 'Director',
                    )?.name ?? null;
            }
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch title' },
            { status: 500 },
        );
    }
};

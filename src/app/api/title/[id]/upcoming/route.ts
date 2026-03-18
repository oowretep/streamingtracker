import { NextRequest, NextResponse } from 'next/server';
import { STREAMING_PLATFORMS } from '@/lib/watchmode';

const BASE_URL = 'https://api.watchmode.com/v1';
const API_KEY = process.env.WATCHMODE_API_KEY;

const getDateDaysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0].replace(/-/g, '');
};

const getDateDaysAhead = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0].replace(/-/g, '');
};

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    const { id } = await params;
    const sourceIds = STREAMING_PLATFORMS.map((p) => p.id).join(',');

    try {
        const res = await fetch(
            `${BASE_URL}/releases/?apiKey=${API_KEY}&source_ids=${sourceIds}&release_date_start=${getDateDaysAgo(1)}&release_date_end=${getDateDaysAhead(60)}&limit=100`,
        );

        const data = await res.json();
        const releases = data.releases ?? [];

        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

        const match = releases.filter(
            (r: {
                id: number;
                source_id: number;
                source_name: string;
                source_release_date: string;
            }) =>
                String(r.id) === id &&
                r.source_release_date.replace(/-/g, '') > today,
        );

        return NextResponse.json(match);
    } catch (error) {
        return NextResponse.json([], { status: 200 });
    }
};

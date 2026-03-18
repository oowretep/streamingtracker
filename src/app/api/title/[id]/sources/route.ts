import { NextRequest, NextResponse } from 'next/server';
import watchmode from '@/lib/watchmode';

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    const { id } = await params;

    try {
        const data = await watchmode.getSources(id);
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { errpr: 'Failed to fetch sources' },
            { status: 500 },
        );
    }
};

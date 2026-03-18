import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { watchlist } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import watchmode from '@/lib/watchmode';

export const GET = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await db
        .select()
        .from(watchlist)
        .where(eq(watchlist.userId, session.user.id));

    return NextResponse.json(items);
};

export const POST = async (req: NextRequest) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { titleId, titleName, titleYear, titleType, poster, listType } = body;

    // fetch streaming sources to store with the item
    let sources = null;
    try {
        const sourcesData = await watchmode.getSources(String(titleId));
        const usSubs = sourcesData
            .filter(
                (s: { region: string; type: string }) =>
                    s.region === 'US' && s.type === 'sub',
            )
            .map((s: { name: string }) => s.name);
        const unique = [...new Set(usSubs)] as string[];
        sources = JSON.stringify(unique);
    } catch {
        // if sources fail just store null
    }

    const id = crypto.randomUUID();

    try {
        const item = await db
            .insert(watchlist)
            .values({
                id,
                userId: session.user.id,
                titleId,
                titleName,
                titleYear,
                titleType,
                poster,
                listType,
                sources,
            })
            .returning();

        return NextResponse.json(item[0]);
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'cause' in error &&
            typeof (error as { cause?: { code?: string } }).cause?.code ===
                'string' &&
            (error as { cause: { code: string } }).cause.code === '23505'
        ) {
            return NextResponse.json(
                { error: 'Already in list' },
                { status: 409 },
            );
        }
        return NextResponse.json({ error: 'Failed to add' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { titleId, listType } = await req.json();

    await db
        .delete(watchlist)
        .where(
            and(
                eq(watchlist.userId, session.user.id),
                eq(watchlist.titleId, titleId),
                eq(watchlist.listType, listType),
            ),
        );

    return NextResponse.json({ success: true });
};

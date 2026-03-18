import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { searchHistory } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import { headers } from 'next/headers';

export const GET = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return NextResponse.json([]);

    const history = await db
        .select()
        .from(searchHistory)
        .where(eq(searchHistory.userId, session.user.id))
        .orderBy(desc(searchHistory.createdAt))
        .limit(5);

    return NextResponse.json(history);
};

export const POST = async (req: NextRequest) => {
    const session = await auth.api.getSession({
        headers: req.headers,
    });

    if (!session)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { query } = await req.json();
    if (!query)
        return NextResponse.json({ error: 'No query' }, { status: 400 });

    const existing = await db
        .select()
        .from(searchHistory)
        .where(
            and(
                eq(searchHistory.userId, session.user.id),
                eq(searchHistory.query, query),
            ),
        );

    if (existing.length > 0) {
        await db
            .update(searchHistory)
            .set({ createdAt: new Date() })
            .where(
                and(
                    eq(searchHistory.userId, session.user.id),
                    eq(searchHistory.query, query),
                ),
            );
    } else {
        await db.insert(searchHistory).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            query,
        });
    }

    return NextResponse.json({ success: true });
};

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { watchlist } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';

export const PATCH = async (req: NextRequest) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { titleId, listType, watched } = await req.json();

    await db
        .update(watchlist)
        .set({ watched })
        .where(
            and(
                eq(watchlist.userId, session.user.id),
                eq(watchlist.titleId, titleId),
                eq(watchlist.listType, listType),
            ),
        );

    return NextResponse.json({ success: true });
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '../db/client';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const link = process.env.CHECK_URL;

    if (link == undefined) {
        console.log('link not found');
        return;
    }
    const res = await fetch(link, {
        method: 'GET',
    });
    console.log('middleware called !');
    return NextResponse.next();
}

export const config = {
    matcher: ['/warehouse'],
};

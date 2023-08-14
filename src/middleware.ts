import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '../db/client';

import { env } from 'process';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const res = await fetch('http://localhost:3000/api/checkDb', {
        method: 'GET',
    });
    console.log('middleware called !');
    return NextResponse.next();
}

export const config = {
    matcher: ['/warehouse'],
};

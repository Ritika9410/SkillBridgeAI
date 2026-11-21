import { NextResponse } from 'next/server';
import { sessionCookieName } from '@/server/auth';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Request was rejected.' }, { status: 403 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

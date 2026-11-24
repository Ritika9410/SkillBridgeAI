import { NextResponse } from 'next/server';
import {
  createSessionToken,
  sessionCookieName,
  sessionLifetimeSeconds,
  sessionSecretIsConfigured,
  verifyPassword,
} from '@/server/auth';
import { getDatabase } from '@/server/mongodb';
import { getDatabaseSetupMessage, getSafeDatabaseErrorLabel } from '@/server/database-error';

export const runtime = 'nodejs';

interface StoredUser {
  _id: { toHexString(): string };
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'tpo';
}

export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return NextResponse.json({ error: 'Request was rejected.' }, { status: 403 });
  if (!sessionSecretIsConfigured()) {
    return NextResponse.json(
      { error: 'Authentication setup is incomplete. Configure AUTH_SECRET in .env.local.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password || email.length > 254 || password.length > 128) {
      return NextResponse.json({ error: 'Enter a valid email and password.' }, { status: 400 });
    }

    const db = await getDatabase();
    const user = await db.collection<StoredUser>('users').findOne({ email });
    const passwordMatches = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!user || !passwordMatches) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    const remember = body.remember === true;
    const maxAge = remember ? sessionLifetimeSeconds : 60 * 60 * 24;
    const safeUser = {
      id: user._id.toHexString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const response = NextResponse.json({ user: safeUser });
    response.cookies.set(sessionCookieName, createSessionToken(safeUser, maxAge), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
    return response;
  } catch (error) {
    console.error('Account login failed:', getSafeDatabaseErrorLabel(error));
    return NextResponse.json(
      {
        error: getDatabaseSetupMessage(error),
      },
      { status: 503 }
    );
  }
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

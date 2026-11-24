import { NextResponse } from 'next/server';
import { MongoServerError, ObjectId } from 'mongodb';
import {
  createSessionToken,
  hashPassword,
  sessionCookieName,
  sessionLifetimeSeconds,
  sessionSecretIsConfigured,
} from '@/server/auth';
import { getDatabase } from '@/server/mongodb';
import { getDatabaseSetupMessage, getSafeDatabaseErrorLabel } from '@/server/database-error';

export const runtime = 'nodejs';

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
    const name = typeof body.fullName === 'string' ? body.fullName.trim().replace(/\s+/g, ' ') : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (body.terms !== true) {
      return NextResponse.json(
        { error: 'Accept the Terms of Service and Privacy Policy to continue.' },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Enter a name between 2 and 100 characters.' },
        { status: 400 }
      );
    }
    if (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128 || !/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: 'Use 8–128 characters with at least one uppercase letter and one number.' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const users = db.collection('users');
    await users.createIndex({ email: 1 }, { unique: true });
    const now = new Date();
    const user = {
      _id: new ObjectId(),
      name,
      email,
      passwordHash: await hashPassword(password),
      role: 'student' as const,
      createdAt: now,
      updatedAt: now,
    };

    await users.insertOne(user);
    return withSession(
      { id: user._id.toHexString(), name: user.name, email: user.email, role: user.role },
      sessionLifetimeSeconds
    );
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }
    console.error('Account registration failed:', getSafeDatabaseErrorLabel(error));
    return NextResponse.json({ error: getDatabaseSetupMessage(error) }, { status: 503 });
  }
}

function withSession(
  user: { id: string; name: string; email: string; role: 'student' | 'tpo' },
  maxAge: number
) {
  const response = NextResponse.json({ user });
  response.cookies.set(sessionCookieName, createSessionToken(user, maxAge), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
  return response;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}


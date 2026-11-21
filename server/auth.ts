import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const scrypt = promisify(scryptCallback);
export const sessionCookieName = 'skillbridge_session';
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tpo';
  exp: number;
}

interface SessionPayload {
  sub: string;
  name: string;
  email: string;
  role: 'student' | 'tpo';
  exp: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, saltText, hashText] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !saltText || !hashText) return false;

  try {
    const salt = Buffer.from(saltText, 'base64url');
    const expected = Buffer.from(hashText, 'base64url');
    const actual = (await scrypt(password, salt, expected.length)) as Buffer;
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createSessionToken(
  user: { id: string; name: string; email: string; role: 'student' | 'tpo' },
  lifetimeSeconds: number
) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + lifetimeSeconds,
    })
  ).toString('base64url');
  const message = `${header}.${payload}`;
  return `${message}.${sign(message)}`;
}

export function verifySessionToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [header, payload, signature, extra] = token.split('.');
  if (!header || !payload || !signature || extra) return null;

  try {
    const parsedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8')) as {
      alg?: string;
      typ?: string;
    };
    if (parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') return null;
    const expected = Buffer.from(sign(`${header}.${payload}`));
    const supplied = Buffer.from(signature);
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionPayload;
    if (
      typeof data.sub !== 'string' ||
      typeof data.name !== 'string' ||
      typeof data.email !== 'string' ||
      (data.role !== 'student' && data.role !== 'tpo') ||
      typeof data.exp !== 'number' ||
      data.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return { id: data.sub, name: data.name, email: data.email, role: data.role, exp: data.exp };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(sessionCookieName)?.value);
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  return user;
}

export function sessionSecretIsConfigured(): boolean {
  return (process.env.AUTH_SECRET?.trim().length ?? 0) >= 32;
}

function sign(payload: string): string {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error(
      'Authentication is not configured. Add a 32-character AUTH_SECRET to .env.local.'
    );
  }
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export { sessionLifetimeSeconds };

import { NextResponse } from 'next/server';
import { getSessionUser } from '@/server/auth';
import { getDatabase } from '@/server/mongodb';
import { getDatabaseSetupMessage } from '@/server/database-error';
import { isSameOrigin } from '@/server/request-origin';
import { emptyStudentProfile } from '@/shared/profileUtils';
import type { StudentProfile } from '@/shared/types/analysisTypes';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

  try {
    const record = await getDatabase()
      .then((db) => db.collection<StudentProfile & { userId: string }>('studentProfiles').findOne({ userId: user.id }));
    if (!record) return NextResponse.json({ profile: emptyStudentProfile(user.name) });
    const { _id, userId: _userId, ...profile } = record;
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Student profile could not be loaded:', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: 'Could not load your profile.' }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request was rejected.' }, { status: 403 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

  let profile: StudentProfile;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    profile = normalizeProfile(body, user.name);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Check the profile fields and try again.' }, { status: 400 });
  }
  try {
    await getDatabase().then((db) =>
      db.collection<StudentProfile & { userId: string }>('studentProfiles').updateOne(
        { userId: user.id },
        { $set: { ...profile, userId: user.id, updatedAt: new Date().toISOString() } },
        { upsert: true }
      )
    );
    return NextResponse.json({ profile: { ...profile, updatedAt: new Date().toISOString() } });
  } catch (error) {
    console.error('Student profile could not be saved:', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: getDatabaseSetupMessage(error) }, { status: 503 });
  }
}

function normalizeProfile(body: Record<string, unknown>, accountName: string): StudentProfile {
  const projects = Array.isArray(body.projects)
    ? body.projects.slice(0, 20).filter(isRecord).map((item) => ({
        name: clean(item.name, 120),
        description: clean(item.description, 1000),
        technologies: stringList(item.technologies, 20, 60),
      })).filter((item) => item.name)
    : [];
  const profile: StudentProfile = {
    fullName: clean(body.fullName, 100) || accountName,
    college: clean(body.college, 160),
    branch: clean(body.branch, 120),
    year: clean(body.year, 40),
    cgpa: clean(body.cgpa, 10),
    skills: stringList(body.skills, 60, 80),
    projects,
    certifications: stringList(body.certifications, 30, 160),
    github: safeUrl(body.github),
    linkedin: safeUrl(body.linkedin),
  };
  if (profile.cgpa && (!Number.isFinite(Number(profile.cgpa)) || Number(profile.cgpa) < 0 || Number(profile.cgpa) > 10)) {
    throw new Error('CGPA must be a number between 0 and 10.');
  }
  if ((body.github && !profile.github) || (body.linkedin && !profile.linkedin)) {
    throw new Error('Social profile links must be valid HTTP or HTTPS URLs.');
  }
  return profile;
}

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function stringList(value: unknown, count: number, max: number): string[] {
  if (Array.isArray(value)) return [...new Set(value.filter((item): item is string => typeof item === 'string').map((item) => item.trim().slice(0, max)).filter(Boolean))].slice(0, count);
  if (typeof value === 'string') return [...new Set(value.split(/[\n,]/).map((item) => item.trim().slice(0, max)).filter(Boolean))].slice(0, count);
  return [];
}

function safeUrl(value: unknown) {
  const text = clean(value, 300);
  if (!text) return '';
  try {
    const url = new URL(text);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

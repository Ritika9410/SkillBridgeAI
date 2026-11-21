import { NextResponse } from 'next/server';
import { getSessionUser } from '@/server/auth';
import { getDatabase } from '@/server/mongodb';
import type { ResumeAnalysisResult } from '@/shared/types/analysisTypes';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

  try {
    const records = await getDatabase().then((db) => db
      .collection<ResumeAnalysisResult & { userId: string }>('resumeAnalyses')
      .find({ userId: user.id }).sort({ analyzedAt: -1 }).limit(8).toArray());
    if (!records.length) return NextResponse.json({ analysis: null });
    const { _id, userId: _userId, ...latest } = records[0];
    const analysis = {
      ...latest,
      history: records.slice().reverse().map(({ analyzedAt, score }) => ({ analyzedAt, score })),
    };
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Latest resume analysis could not be loaded:', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: 'Could not load your latest resume analysis.' }, { status: 503 });
  }
}

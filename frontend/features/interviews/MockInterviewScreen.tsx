'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from '@/frontend/components/ui/AppIcon';
import type { InterviewSession } from '@/shared/types/analysisTypes';

export default function MockInterviewScreen() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [active, setActive] = useState<InterviewSession | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const currentQuestion = active?.questions.find((question) => !question.answer);
  const progress = active ? Math.round((active.questions.filter((question) => question.answer).length / active.questions.length) * 100) : 0;
  const averages = useMemo(() => {
    if (!active?.questions.length) return null;
    const scoreFor = (key: 'communicationScore' | 'technicalScore' | 'confidenceScore') => {
      const values = active.questions.map((question) => question[key]).filter((value): value is number => typeof value === 'number');
      return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
    };
    return { communication: scoreFor('communicationScore'), technical: scoreFor('technicalScore'), confidence: scoreFor('confidenceScore') };
  }, [active]);

  const load = async () => {
    try {
      const response = await fetch('/api/interviews', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load interviews.');
      const all = payload.sessions as InterviewSession[];
      setSessions(all);
      setActive(all.find((session) => session.status === 'in_progress') ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load interviews.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const start = async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/interviews', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not start an interview.');
      setActive(payload.session);
      setSessions((current) => [payload.session, ...current]);
      setAnswer('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not start an interview.');
    } finally { setBusy(false); }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!active || !currentQuestion) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/interviews', {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: active.id, questionId: currentQuestion.id, answer }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not evaluate your answer.');
      setActive(payload.session);
      setSessions((current) => current.map((session) => session.id === payload.session.id ? payload.session : session));
      setAnswer('');
      if (payload.session.status === 'completed') window.dispatchEvent(new Event('skillbridge:interview-updated'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not evaluate your answer.');
    } finally { setBusy(false); }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading interview…</div>;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">AI mock interview</p>
        <h1 className="text-3xl font-bold mt-2">Practice for your target role</h1>
        <p className="text-sm text-muted-foreground mt-2">Gemini creates role-specific questions and evaluates each written answer. Your scores are saved to your account.</p>
      </header>

      {!active ? (
        <section className="bg-card border border-border rounded-2xl p-7 space-y-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center"><Icon name="ChatBubbleLeftRightIcon" size={22} className="text-primary" /></div>
          <h2 className="text-lg font-semibold">{sessions.length ? 'Start another interview' : 'Ready to begin?'}</h2>
          <p className="text-sm text-muted-foreground">Questions are personalized from your latest resume analysis. Submit one answer at a time to receive communication, technical, and confidence feedback.</p>
          <button onClick={() => void start()} disabled={busy} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-60">{busy ? 'Generating questions…' : 'Start interview'}</button>
        </section>
      ) : (
        <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs text-muted-foreground">Target role</p><h2 className="font-semibold">{active.roleName}</h2></div>
            <span className="text-sm text-primary font-semibold">{progress}% complete</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
          {currentQuestion ? (
            <>
              <div className="rounded-xl border border-border bg-secondary/30 p-5">
                <p className="text-xs text-muted-foreground mb-2">Question {active.questions.findIndex((q) => q.id === currentQuestion.id) + 1} of {active.questions.length}</p>
                <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
              </div>
              <form onSubmit={submit} className="space-y-3">
                <label htmlFor="interview-answer" className="block text-sm font-medium">Your answer</label>
                <textarea id="interview-answer" required minLength={5} maxLength={5000} rows={7} value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write your answer here…" className="w-full rounded-xl bg-secondary border border-border p-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
                {error && <p role="alert" className="text-sm text-negative">{error}</p>}
                <button disabled={busy || answer.trim().length < 5} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-60">{busy ? 'Getting AI feedback…' : 'Submit answer for feedback'}</button>
              </form>
            </>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl border border-positive/30 bg-positive/5 p-5 text-center">
                <p className="text-sm text-positive font-semibold">Interview complete</p>
                <p className="text-5xl font-bold mt-2">{active.score ?? '—'}<span className="text-lg text-muted-foreground">/100</span></p>
                <p className="text-xs text-muted-foreground mt-2">Average across AI-rated answers</p>
              </div>
              {averages && <div className="grid sm:grid-cols-3 gap-3">{Object.entries({ Communication: averages.communication, Technical: averages.technical, Confidence: averages.confidence }).map(([label, score]) => <div key={label} className="bg-secondary/40 rounded-xl p-4 text-center"><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-semibold mt-1">{score}/100</p></div>)}</div>}
            </div>
          )}
          <div className="space-y-3 border-t border-border pt-5">
            {active.questions.filter((q) => q.feedback).map((q) => <article key={q.id} className="rounded-xl border border-border p-4 space-y-2"><p className="text-xs font-semibold">Answer feedback · Question {active.questions.findIndex((item) => item.id === q.id) + 1}</p><p className="text-sm text-muted-foreground whitespace-pre-wrap">{q.feedback}</p><p className="text-[11px] text-muted-foreground">Communication {q.communicationScore} · Technical {q.technicalScore} · Confidence {q.confidenceScore}</p></article>)}
          </div>
        </section>
      )}
      {error && !active && <p role="alert" className="text-sm text-negative">{error}</p>}
      {sessions.some((session) => session.status === 'completed') && <section className="bg-card border border-border rounded-2xl p-5"><h2 className="font-semibold">Recent interview scores</h2><ul className="mt-3 space-y-2">{sessions.filter((session) => session.status === 'completed').slice(0, 5).map((session) => <li key={session.id} className="flex justify-between text-sm"><span>{session.roleName} · {new Date(session.completedAt ?? session.createdAt).toLocaleDateString()}</span><b>{session.score ?? '—'}/100</b></li>)}</ul></section>}
      <Link href="/placement-dashboard" className="text-sm text-accent">← Back to dashboard</Link>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/frontend/components/ui/AppIcon';
import Badge from '@/frontend/components/ui/Badge';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import type { RoadmapPlan } from '@/shared/types/analysisTypes';

export default function RoadmapTaskList() {
  const [plan, setPlan] = useState<RoadmapPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const analysis = useResumeAnalysis();

  const loadPlan = useCallback(async () => {
    try {
      const response = await fetch('/api/roadmap', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load roadmap.');
      setPlan(payload.plan);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load roadmap.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadPlan(); }, [loadPlan]);

  const generate = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/roadmap', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not generate roadmap.');
      setPlan(payload.plan);
      window.dispatchEvent(new Event('skillbridge:roadmap-updated'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not generate roadmap.');
    } finally {
      setBusy(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!plan) return;
    const previous = plan;
    setPlan({ ...plan, tasks: plan.tasks.map((task) => task.id === taskId ? { ...task, completed } : task) });
    try {
      const response = await fetch('/api/roadmap', {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ taskId, completed }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not update task.');
      setPlan(payload.plan);
      window.dispatchEvent(new Event('skillbridge:roadmap-updated'));
    } catch (reason) {
      setPlan(previous);
      setError(reason instanceof Error ? reason.message : 'Could not update task.');
    }
  };

  const completed = plan?.tasks.filter((task) => task.completed).length ?? 0;
  const progress = plan?.tasks.length ? Math.round((completed / plan.tasks.length) * 100) : 0;
  const isCurrent = !!plan && !!analysis && plan.analysisFingerprint === analysis.fingerprint;

  return (
    <section id="roadmap" className="bg-card border border-border rounded-2xl p-5 space-y-4 scroll-mt-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Personalized learning roadmap</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {isCurrent ? `Gemini plan for ${plan.roleName}` : analysis ? 'A new resume was analyzed; regenerate your plan to match it.' : 'Analyze a resume to create a role-specific plan.'}
          </p>
        </div>
        {plan && <Badge variant="info">{progress}%</Badge>}
      </div>

      {plan && <div className="h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} /></div>}

      {loading ? <p className="text-xs text-muted-foreground">Loading roadmap…</p> : plan ? (
        <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {plan.tasks.map((task) => (
            <li key={task.id} className={`p-3 rounded-lg border ${task.completed ? 'border-transparent bg-secondary/30 opacity-65' : 'border-border'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input aria-label={`Mark ${task.title} complete`} type="checkbox" checked={task.completed} onChange={(event) => void toggleTask(task.id, event.target.checked)} className="mt-1 rounded border-border text-primary focus:ring-ring" />
                <span className="flex-1 min-w-0">
                  <span className={`block text-xs font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>Week {task.week}: {task.title}</span>
                  <span className="block text-[11px] text-muted-foreground mt-1">{task.skill} · {task.estimatedHours} hours</span>
                  <span className="block text-[11px] text-muted-foreground mt-1">{task.description}</span>
                </span>
                <Icon name="SparklesIcon" size={14} className="text-accent" />
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-4 text-center space-y-2">
          <p className="text-xs text-muted-foreground">No personalized learning plan yet.</p>
          {analysis ? <button onClick={() => void generate()} disabled={busy} className="text-xs font-semibold text-accent disabled:opacity-60">{busy ? 'Generating with Gemini…' : 'Generate four-week plan'}</button> : <Link href="/resume-analyzer" className="text-xs font-semibold text-accent">Analyze a resume →</Link>}
        </div>
      )}
      {plan && analysis && !isCurrent && <button onClick={() => void generate()} disabled={busy} className="text-xs text-accent disabled:opacity-60">{busy ? 'Generating…' : 'Regenerate for latest resume'}</button>}
      {error && <p role="alert" className="text-xs text-negative">{error}</p>}
    </section>
  );
}

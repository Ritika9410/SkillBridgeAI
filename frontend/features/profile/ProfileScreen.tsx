'use client';

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import type { StudentProfile } from '@/shared/types/analysisTypes';
import { emptyStudentProfile, getProfileCompletion } from '@/shared/profileUtils';

const blankProfile: StudentProfile = emptyStudentProfile();
const fieldClass = 'w-full rounded-lg bg-secondary border border-border px-3 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-ring';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(blankProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const completion = useMemo(() => getProfileCompletion(profile), [profile]);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Could not load profile.');
        setProfile({ ...blankProfile, ...payload.profile });
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) =>
    setProfile((current) => ({ ...current, [key]: value }));

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save profile.');
      setProfile({ ...blankProfile, ...payload.profile });
      setMessage('Profile saved. Your dashboard completion score is up to date.');
      window.dispatchEvent(new Event('skillbridge:profile-updated'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="bg-card border border-border rounded-2xl p-8 text-muted-foreground">Loading your profile…</section>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Student profile</p>
          <h1 className="text-3xl font-bold mt-2">Your career profile</h1>
          <p className="text-sm text-muted-foreground mt-2">Add your academic details and experience to personalize your readiness plan.</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 min-w-44">
          <div className="flex justify-between text-sm"><span>Completion</span><b>{completion}%</b></div>
          <div className="h-2 bg-secondary rounded-full mt-3 overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${completion}%` }} /></div>
        </div>
      </header>

      <form onSubmit={save} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-8">
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">Personal and academic details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name"><input className={fieldClass} required maxLength={100} value={profile.fullName} onChange={(e) => update('fullName', e.target.value)} /></Field>
            <Field label="College"><input className={fieldClass} maxLength={160} value={profile.college} onChange={(e) => update('college', e.target.value)} /></Field>
            <Field label="Branch"><input className={fieldClass} maxLength={120} value={profile.branch} onChange={(e) => update('branch', e.target.value)} /></Field>
            <Field label="Year"><input className={fieldClass} placeholder="e.g. 3rd year" maxLength={40} value={profile.year} onChange={(e) => update('year', e.target.value)} /></Field>
            <Field label="CGPA (0–10)"><input className={fieldClass} type="number" min="0" max="10" step="0.01" value={profile.cgpa} onChange={(e) => update('cgpa', e.target.value)} /></Field>
            <Field label="Skills (comma-separated)"><input className={fieldClass} value={profile.skills.join(', ')} onChange={(e) => update('skills', splitList(e.target.value))} /></Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-lg">Projects and certifications</h2>
          <Field label="Projects (one per line: name | description | technologies)">
            <textarea className={fieldClass} rows={5} value={profile.projects.map((p) => `${p.name} | ${p.description} | ${p.technologies.join(', ')}`).join('\n')} onChange={(e) => update('projects', e.target.value.split('\n').map((line) => { const [name = '', description = '', technologies = ''] = line.split('|'); return { name: name.trim(), description: description.trim(), technologies: splitList(technologies) }; }).filter((p) => p.name))} />
          </Field>
          <Field label="Certifications (comma-separated)"><textarea className={fieldClass} rows={2} value={profile.certifications.join(', ')} onChange={(e) => update('certifications', splitList(e.target.value))} /></Field>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-lg">Professional links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub URL"><input className={fieldClass} type="url" placeholder="https://github.com/username" value={profile.github} onChange={(e) => update('github', e.target.value)} /></Field>
            <Field label="LinkedIn URL"><input className={fieldClass} type="url" placeholder="https://linkedin.com/in/username" value={profile.linkedin} onChange={(e) => update('linkedin', e.target.value)} /></Field>
          </div>
        </section>

        {(message || error) && <p role="status" className={error ? 'text-sm text-negative' : 'text-sm text-positive'}>{error || message}</p>}
        <div className="flex flex-wrap gap-3">
          <button disabled={saving} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-60">{saving ? 'Saving…' : 'Save profile'}</button>
          <Link href="/placement-dashboard" className="px-5 py-2.5 rounded-lg border border-border text-sm">Back to dashboard</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1.5 text-sm"><span className="text-muted-foreground">{label}</span>{children}</label>;
}

function splitList(value: string) { return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]; }

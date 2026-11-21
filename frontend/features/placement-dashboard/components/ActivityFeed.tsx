'use client';

import Link from 'next/link';
import Icon from '@/frontend/components/ui/AppIcon';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { usePlacementData } from '../hooks/usePlacementData';

export default function ActivityFeed() {
  const analysis = useResumeAnalysis();
  const { profile, roadmap, latestInterview } = usePlacementData();
  const activities = [
    ...(analysis ? [{ id: 'analysis', title: 'Resume analyzed', detail: `${analysis.roleName} · ${analysis.score}/100`, time: analysis.analyzedAt, icon: 'DocumentTextIcon', color: 'text-accent' }] : []),
    ...(latestInterview ? [{ id: 'interview', title: 'Mock interview completed', detail: `${latestInterview.roleName} · ${latestInterview.score}/100`, time: latestInterview.completedAt ?? latestInterview.createdAt, icon: 'ChatBubbleLeftRightIcon', color: 'text-warning' }] : []),
    ...(roadmap ? [{ id: 'roadmap', title: 'Learning roadmap generated', detail: `${roadmap.roleName} · ${roadmap.tasks.filter((task) => task.completed).length}/${roadmap.tasks.length} tasks complete`, time: roadmap.generatedAt, icon: 'MapIcon', color: 'text-positive' }] : []),
    ...(profile.updatedAt ? [{ id: 'profile', title: 'Student profile updated', detail: 'Academic and career details saved', time: profile.updatedAt, icon: 'UserCircleIcon', color: 'text-muted-foreground' }] : []),
  ].sort((a, b) => Date.parse(b.time) - Date.parse(a.time));

  return <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
    <div><h2 className="text-sm font-semibold text-foreground">Recent activity</h2><p className="text-xs text-muted-foreground mt-0.5">Updates saved to your account</p></div>
    {activities.length ? <ul className="space-y-3">{activities.slice(0, 5).map((item) => <li key={item.id} className="flex items-start gap-3"><div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><Icon name={item.icon} size={15} className={item.color}/></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item.title}</p><p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p><time className="text-[10px] text-muted-foreground" dateTime={item.time}>{new Date(item.time).toLocaleString()}</time></div></li>)}</ul> : <div className="rounded-xl border border-dashed border-border p-4 text-center"><p className="text-xs text-muted-foreground">Your completed resume analyses, roadmap, and interviews will appear here.</p><Link href="/resume-analyzer" className="inline-block mt-2 text-xs text-accent">Analyze a resume →</Link></div>}
  </section>;
}

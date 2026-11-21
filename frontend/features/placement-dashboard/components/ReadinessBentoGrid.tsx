'use client';

import Link from 'next/link';
import React from 'react';
import Icon from '@/frontend/components/ui/AppIcon';
import Badge from '@/frontend/components/ui/Badge';
import { getProfileCompletion } from '@/shared/profileUtils';
import type { InterviewQuestion } from '@/shared/types/analysisTypes';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { usePlacementData } from '../hooks/usePlacementData';
import { getPlannedSkills } from '../utils/resumePlan';

type Status = 'positive' | 'negative' | 'warning' | 'info';
type InterviewScoreKey = 'communicationScore' | 'technicalScore' | 'confidenceScore';

interface Metric {
  id: string;
  label: string;
  value: number | null;
  unit: string;
  status: Status;
  icon: string;
  detail: string;
  progress: number | null;
  supportingMetrics?: { label: string; value: string }[];
  tags?: string[];
  emptyMessage?: string;
  action?: { label: string; href: string };
}

const barColor: Record<Status, string> = {
  positive: 'bg-positive',
  negative: 'bg-negative',
  warning: 'bg-warning',
  info: 'bg-accent',
};

const textColor: Record<Status, string> = {
  positive: 'text-positive',
  negative: 'text-negative',
  warning: 'text-warning',
  info: 'text-accent',
};

const bgColor: Record<Status, string> = {
  positive: 'bg-[var(--positive-bg)]',
  negative: 'bg-[var(--negative-bg)]',
  warning: 'bg-[var(--warning-bg)]',
  info: 'bg-[var(--info-bg)]',
};

export default function ReadinessBentoGrid() {
  const analysis = useResumeAnalysis();
  const { profile, roadmap, latestInterview } = usePlacementData();
  const plannedSkills = analysis ? getPlannedSkills(analysis, profile.skills) : [];
  const skillGaps = plannedSkills.filter((skill) => skill.gap > 0);
  const matchedSkillCount = plannedSkills.length - skillGaps.length;
  const skillMatch = plannedSkills.length
    ? Math.round((matchedSkillCount / plannedSkills.length) * 100)
    : null;
  const profileCompletion = getProfileCompletion(profile);
  const currentRoadmap =
    !!roadmap && !!analysis && roadmap.analysisFingerprint === analysis.fingerprint;
  const completedRoadmapTasks = currentRoadmap
    ? roadmap.tasks.filter((task) => task.completed).length
    : 0;
  const roadmapProgress =
    currentRoadmap && roadmap.tasks.length
      ? Math.round((completedRoadmapTasks / roadmap.tasks.length) * 100)
      : null;
  const highPriorityGaps =
    analysis?.missingKeywords.filter((item) => item.importance === 'high').length ?? 0;

  const metrics: Metric[] = [
    {
      id: 'ats',
      label: 'Resume Score',
      value: analysis?.score ?? null,
      unit: '/100',
      status: 'warning',
      icon: 'DocumentMagnifyingGlassIcon',
      detail: analysis
        ? `Analysis for ${analysis.roleName}`
        : 'Analyze a PDF resume to get your score.',
      progress: analysis?.score ?? null,
      supportingMetrics: analysis
        ? [
            { label: 'Readability', value: `${analysis.readabilityScore ?? '—'}/100` },
            { label: 'Formatting', value: `${analysis.formattingScore ?? '—'}/100` },
            { label: 'Role fit', value: `${analysis.roleFitScore ?? '—'}/100` },
            { label: 'Pages', value: `${analysis.pageCount ?? '—'}` },
          ]
        : undefined,
      action: {
        label: analysis ? 'Review resume feedback' : 'Analyze resume',
        href: '/resume-analyzer',
      },
    },
    {
      id: 'skills',
      label: 'Skill Match',
      value: skillMatch,
      unit: '%',
      status: 'warning',
      icon: 'PuzzlePieceIcon',
      detail: analysis
        ? `${skillGaps.length} role skills to focus on.`
        : 'Analyze a resume for role-specific gaps.',
      progress: skillMatch,
      supportingMetrics: analysis
        ? [
            { label: 'Matched', value: `${matchedSkillCount}/${plannedSkills.length}` },
            { label: 'To build', value: `${skillGaps.length}` },
            { label: 'High priority', value: `${highPriorityGaps}` },
          ]
        : undefined,
      tags: skillGaps.slice(0, 2).map((skill) => skill.name),
      action: { label: 'Review skill gaps', href: '/placement-dashboard#skill-gap' },
    },
    {
      id: 'interview',
      label: 'Interview Score',
      value: latestInterview?.score ?? null,
      unit: '/100',
      status: 'negative',
      icon: 'ChatBubbleLeftRightIcon',
      detail: latestInterview
        ? `Latest completed ${latestInterview.roleName} interview.`
        : 'No completed mock interview yet.',
      progress: latestInterview?.score ?? null,
      supportingMetrics: latestInterview
        ? [
            {
              label: 'Communication',
              value: averageAnswerScore(latestInterview.questions, 'communicationScore'),
            },
            {
              label: 'Technical',
              value: averageAnswerScore(latestInterview.questions, 'technicalScore'),
            },
            {
              label: 'Confidence',
              value: averageAnswerScore(latestInterview.questions, 'confidenceScore'),
            },
          ]
        : undefined,
      emptyMessage: 'Answer role-based questions to receive feedback and a score.',
      action: {
        label: latestInterview ? 'Practice another interview' : 'Start mock interview',
        href: '/mock-interview',
      },
    },
    {
      id: 'profile',
      label: 'Profile Completion',
      value: profileCompletion,
      unit: '%',
      status: 'positive',
      icon: 'UserCircleIcon',
      detail: `${Math.max(0, Math.round((100 - profileCompletion) / 10))} profile fields to complete.`,
      progress: profileCompletion,
      supportingMetrics: [
        { label: 'Skills', value: `${profile.skills.length}` },
        { label: 'Projects', value: `${profile.projects.length}` },
        { label: 'Certificates', value: `${profile.certifications.length}` },
      ],
      action: {
        label: profileCompletion < 100 ? 'Complete profile' : 'View profile',
        href: '/profile',
      },
    },
    {
      id: 'roadmap',
      label: 'Roadmap Progress',
      value: roadmapProgress,
      unit: '%',
      status: 'info',
      icon: 'MapIcon',
      detail: currentRoadmap
        ? `${completedRoadmapTasks} of ${roadmap.tasks.length} tasks completed.`
        : roadmap
          ? 'This plan is for an earlier resume analysis.'
          : 'Create a learning plan from your resume analysis.',
      progress: roadmapProgress,
      supportingMetrics: currentRoadmap
        ? [
            { label: 'Completed', value: `${completedRoadmapTasks}` },
            { label: 'Remaining', value: `${roadmap.tasks.length - completedRoadmapTasks}` },
            { label: 'Plan length', value: '4 weeks' },
          ]
        : undefined,
      emptyMessage: roadmap
        ? 'Regenerate the plan to match your latest resume.'
        : 'Generate a personalized four-week learning plan.',
      action: {
        label: currentRoadmap ? 'View roadmap' : roadmap ? 'Refresh roadmap' : 'Create roadmap',
        href: '/placement-dashboard#roadmap',
      },
    },
  ];

  const available = metrics.flatMap((metric) => (metric.value === null ? [] : [metric.value]));
  const overallScore =
    analysis && available.length
      ? Math.round(available.reduce((sum, value) => sum + value, 0) / available.length)
      : null;
  const nextAction = !analysis
    ? {
        title: 'Analyze your resume',
        detail: 'Start with a role-specific Gemini assessment.',
        href: '/resume-analyzer',
        action: 'Analyze resume',
      }
    : !currentRoadmap
      ? {
          title: 'Generate your learning roadmap',
          detail: 'Create a four-week AI plan from your current skill gaps.',
          href: '/placement-dashboard#roadmap',
          action: 'Open roadmap',
        }
      : !latestInterview
        ? {
            title: 'Practice a mock interview',
            detail: `Get questions tailored to ${analysis.roleName}.`,
            href: '/mock-interview',
            action: 'Start interview',
          }
        : profileCompletion < 100
          ? {
              title: 'Complete your student profile',
              detail: 'Your profile details contribute to placement readiness.',
              href: '/profile',
              action: 'Edit profile',
            }
          : {
              title: 'Keep building readiness',
              detail: `Your latest analysis is for ${analysis.roleName}.`,
              href: '/resume-analyzer',
              action: 'Analyze again',
            };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <section className="col-span-1 md:col-span-2 bg-card border border-border rounded-2xl p-6 relative overflow-hidden card-hover">
        <div className="absolute top-0 right-0 w-48 h-48 blob-primary pointer-events-none opacity-60" />
        <div className="relative z-10 flex flex-col h-full gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Overall Placement Readiness
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Average of your available, saved readiness measures
              </p>
            </div>
            <Badge
              variant={
                overallScore === null
                  ? 'muted'
                  : overallScore >= 80
                    ? 'positive'
                    : overallScore >= 60
                      ? 'warning'
                      : 'negative'
              }
            >
              {overallScore === null
                ? 'Start with resume'
                : overallScore >= 80
                  ? 'On track'
                  : overallScore >= 60
                    ? 'In progress'
                    : 'Needs focus'}
            </Badge>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-bold text-foreground tabular-nums">
                  {overallScore ?? '—'}
                </span>
                <span className="text-2xl font-semibold text-muted-foreground">
                  {overallScore === null ? '' : '%'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analysis
                  ? `Based on ${available.length} current measure${available.length === 1 ? '' : 's'} · target 85%`
                  : 'Your score appears after your first resume analysis'}
              </p>
            </div>
            {overallScore !== null && (
              <div className="flex-1 flex justify-end">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${overallScore * 2.638} ${264 - overallScore * 2.638}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{overallScore}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-border">
            {metrics.map((metric) => (
              <div key={metric.id} className="text-center">
                <div className="h-1 bg-secondary rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full ${barColor[metric.status]}`}
                    style={{ width: `${metric.progress ?? 0}%` }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground truncate">
                  {metric.label.split(' ')[0]}
                </p>
                <p className={`text-[10px] font-bold tabular-nums ${textColor[metric.status]}`}>
                  {metric.value === null ? '—' : `${metric.value}${metric.unit === '%' ? '%' : ''}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {metrics.slice(0, 2).map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
      {metrics.slice(2).map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}

      <section className="bg-card border border-accent/30 rounded-2xl p-5 flex flex-col justify-between gap-4 card-hover">
        <div>
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
            <Icon name="SparklesIcon" size={16} className="text-accent" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Recommended next step
          </p>
          <h2 className="text-base font-semibold mt-2">{nextAction.title}</h2>
          <p className="text-xs text-muted-foreground mt-2">{nextAction.detail}</p>
        </div>
        <Link
          href={nextAction.href}
          className="text-sm font-semibold text-accent hover:text-accent/80"
        >
          {nextAction.action} →
        </Link>
      </section>
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <section className="h-full bg-card border border-border rounded-2xl p-5 card-hover flex flex-col justify-between gap-4 relative overflow-hidden">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {metric.label}
          </p>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColor[metric.status]}`}
          >
            <Icon name={metric.icon} size={16} className={textColor[metric.status]} />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-metric-lg tabular-nums ${metric.status === 'negative' && metric.value !== null ? 'text-negative' : 'text-foreground'}`}
          >
            {metric.value ?? '—'}
          </span>
          {metric.value !== null && (
            <span className="text-sm text-muted-foreground">{metric.unit}</span>
          )}
        </div>
        {metric.progress !== null ? (
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor[metric.status]}`}
              style={{ width: `${metric.progress}%` }}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-secondary/40 px-3 py-2">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {metric.emptyMessage ?? 'Complete this step to see your result here.'}
            </p>
          </div>
        )}
        <p className="text-[11px] text-muted-foreground leading-relaxed">{metric.detail}</p>
        {metric.supportingMetrics && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            {metric.supportingMetrics.map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-lg bg-secondary/50 px-2 py-2 text-center"
              >
                <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
                <p className="text-[9px] text-muted-foreground truncate">{item.label}</p>
              </div>
            ))}
          </div>
        )}
        {metric.tags && metric.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {metric.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--warning-bg)] px-2 py-1 text-[10px] text-warning"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {metric.action && (
        <Link
          href={metric.action.href}
          className="inline-flex items-center gap-1 self-start text-xs font-semibold text-accent hover:text-accent/80"
        >
          {metric.action.label}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </section>
  );
}

function averageAnswerScore(questions: InterviewQuestion[], key: InterviewScoreKey): string {
  const scores = questions
    .map((question) => question[key])
    .filter((score): score is number => typeof score === 'number');
  return scores.length
    ? `${Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)}/10`
    : '—';
}

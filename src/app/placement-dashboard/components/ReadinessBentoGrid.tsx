'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';

interface MetricCardData {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number;
  trendLabel: string;
  status: 'positive' | 'negative' | 'warning' | 'info';
  icon: string;
  detail: string;
  progress: number;
}

const metrics: MetricCardData[] = [
  {
    id: 'metric-ats',
    label: 'ATS Score',
    value: 74,
    unit: '/100',
    trend: +8,
    trendLabel: 'vs last scan',
    status: 'warning',
    icon: 'DocumentMagnifyingGlassIcon',
    detail: 'Needs improvement to pass top-tier ATS',
    progress: 74,
  },
  {
    id: 'metric-skill',
    label: 'Skill Match',
    value: 68,
    unit: '%',
    trend: +12,
    trendLabel: 'for SDE roles',
    status: 'warning',
    icon: 'PuzzlePieceIcon',
    detail: '7 skills missing for target role',
    progress: 68,
  },
  {
    id: 'metric-interview',
    label: 'Interview Score',
    value: 61,
    unit: '/100',
    trend: -4,
    trendLabel: 'last 3 sessions',
    status: 'negative',
    icon: 'ChatBubbleLeftRightIcon',
    detail: 'Needs practice — declining trend',
    progress: 61,
  },
  {
    id: 'metric-profile',
    label: 'Profile Completion',
    value: 82,
    unit: '%',
    trend: +5,
    trendLabel: 'this week',
    status: 'positive',
    icon: 'UserCircleIcon',
    detail: 'Add 2 more projects to reach 100%',
    progress: 82,
  },
  {
    id: 'metric-roadmap',
    label: 'Roadmap Progress',
    value: 57,
    unit: '%',
    trend: +14,
    trendLabel: 'this week',
    status: 'info',
    icon: 'MapIcon',
    detail: '3 of 7 this week completed',
    progress: 57,
  },
];

const statusBarColor: Record<string, string> = {
  positive: 'bg-positive',
  negative: 'bg-negative',
  warning: 'bg-warning',
  info: 'bg-accent',
};

const statusTextColor: Record<string, string> = {
  positive: 'text-positive',
  negative: 'text-negative',
  warning: 'text-warning',
  info: 'text-accent',
};

const statusBgColor: Record<string, string> = {
  positive: 'bg-[var(--positive-bg)]',
  negative: 'bg-[var(--negative-bg)]',
  warning: 'bg-[var(--warning-bg)]',
  info: 'bg-[var(--info-bg)]',
};

export default function ReadinessBentoGrid() {
  const overallScore = 72;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Hero Card — Overall Readiness — spans 2 cols */}
      <div className="col-span-1 md:col-span-2 bg-card border border-border rounded-2xl p-6 relative overflow-hidden card-hover">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-48 h-48 blob-primary pointer-events-none opacity-60" />

        <div className="relative z-10 flex flex-col h-full gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Overall Placement Readiness
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Composite score · Updated now</p>
            </div>
            <Badge variant="warning">Action Required</Badge>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-bold text-foreground tabular-nums">
                  {overallScore}
                </span>
                <span className="text-2xl font-semibold text-muted-foreground">%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Icon name="ArrowTrendingUpIcon" size={14} className="text-positive" />
                <span className="text-xs text-positive font-medium">+6% this week</span>
                <span className="text-xs text-muted-foreground">· Target: 85%</span>
              </div>
            </div>

            {/* Mini progress ring visual */}
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
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {overallScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown mini bars */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-border">
            {metrics.map((m) => (
              <div key={`hero-breakdown-${m.id}`} className="text-center">
                <div className="h-1 bg-secondary rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full ${statusBarColor[m.status]}`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground truncate">{m.label.split(' ')[0]}</p>
                <p className={`text-[10px] font-bold tabular-nums ${statusTextColor[m.status]}`}>
                  {m.value}
                  {m.unit === '%' ? '%' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      {metrics.slice(0, 2).map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}

      {/* Row 2: 3 metric cards */}
      {metrics.slice(2).map((metric) => (
        <div key={`row2-${metric.id}`} className="col-span-1 md:col-span-1">
          <MetricCard metric={metric} />
        </div>
      ))}

      {/* Placement Drive Countdown — fills 4th slot in row 2 */}
      <div className="col-span-1 bg-card border border-accent/30 rounded-2xl p-5 relative overflow-hidden card-hover">
        <div className="absolute inset-0 blob-accent opacity-40 pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="CalendarDaysIcon" size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Next Drive
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-accent tabular-nums">14</span>
            <span className="text-base font-semibold text-muted-foreground">days</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Infosys Campus Drive</p>
            <p className="text-xs text-muted-foreground">10 Aug 2026 · NITK Surathkal</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="info">SDE Roles</Badge>
            <Badge variant="muted">300+ seats</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: MetricCardData }) {
  return (
    <div
      className={`bg-card border border-border rounded-2xl p-5 card-hover space-y-3 relative overflow-hidden`}
    >
      {metric.status === 'negative' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-negative rounded-t-2xl" />
      )}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {metric.label}
        </p>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusBgColor[metric.status]}`}
        >
          <Icon
            name={metric.icon as Parameters<typeof Icon>[0]['name']}
            size={16}
            className={statusTextColor[metric.status]}
          />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span
          className={`text-metric-lg tabular-nums ${metric.status === 'negative' ? 'text-negative' : 'text-foreground'}`}
        >
          {metric.value}
        </span>
        <span className="text-sm text-muted-foreground">{metric.unit}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${statusBarColor[metric.status]}`}
          style={{ width: `${metric.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground leading-tight">{metric.detail}</p>
        <div
          className={`flex items-center gap-0.5 text-[11px] font-semibold ${metric.trend >= 0 ? 'text-positive' : 'text-negative'}`}
        >
          <Icon name={metric.trend >= 0 ? 'ArrowUpIcon' : 'ArrowDownIcon'} size={10} />
          {Math.abs(metric.trend)}
          {metric.unit === '%' ? 'pp' : 'pts'}
        </div>
      </div>
    </div>
  );
}

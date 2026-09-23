'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';

const ATSGaugeChart = dynamic(() => import('./ATSGaugeChart'), { ssr: false });

interface ATSScorePanelProps {
  fileName: string;
  selectedRole: string;
  jobRoles: { id: string; label: string }[];
}

const sectionScores = [
  {
    id: 'sec-contact',
    name: 'Contact Info',
    score: 95,
    maxScore: 100,
    status: 'positive' as const,
  },
  {
    id: 'sec-summary',
    name: 'Professional Summary',
    score: 60,
    maxScore: 100,
    status: 'warning' as const,
  },
  {
    id: 'sec-experience',
    name: 'Work Experience',
    score: 78,
    maxScore: 100,
    status: 'warning' as const,
  },
  { id: 'sec-education', name: 'Education', score: 92, maxScore: 100, status: 'positive' as const },
  {
    id: 'sec-skills',
    name: 'Technical Skills',
    score: 71,
    maxScore: 100,
    status: 'warning' as const,
  },
  { id: 'sec-projects', name: 'Projects', score: 65, maxScore: 100, status: 'warning' as const },
];

const statusBarColor: Record<string, string> = {
  positive: 'bg-positive',
  warning: 'bg-warning',
  negative: 'bg-negative',
};

const statusTextColor: Record<string, string> = {
  positive: 'text-positive',
  warning: 'text-warning',
  negative: 'text-negative',
};

export default function ATSScorePanel({ fileName, selectedRole, jobRoles }: ATSScorePanelProps) {
  const atsScore = 74;
  const readabilityScore = 81;
  const formatScore = 68;

  const roleName = jobRoles.find((r) => r.id === selectedRole)?.label || '';

  const scoreLabel =
    atsScore >= 85
      ? 'Excellent'
      : atsScore >= 70
        ? 'Good — Needs Improvement'
        : atsScore >= 55
          ? 'Average — Act Now'
          : 'Poor — Significant Rework Required';

  const scoreBadge = atsScore >= 85 ? 'positive' : atsScore >= 70 ? 'warning' : 'negative';

  return (
    <div className="space-y-4">
      {/* ATS Score Card */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">ATS Score</h3>
            <p
              className="text-xs text-muted-foreground mt-0.5 truncate max-w-[180px]"
              title={fileName}
            >
              {fileName}
            </p>
          </div>
          <Badge variant={scoreBadge as 'positive' | 'warning' | 'negative'}>
            {scoreLabel.split(' — ')[0]}
          </Badge>
        </div>

        {/* Gauge */}
        <div className="flex flex-col items-center">
          <ATSGaugeChart score={atsScore} />
          <p className="text-xs text-muted-foreground text-center mt-2">{scoreLabel}</p>
        </div>

        {/* Target role */}
        <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2">
          <Icon name="BriefcaseIcon" size={14} className="text-accent flex-shrink-0" />
          <p className="text-xs text-muted-foreground truncate">
            Analyzed for:{' '}
            <span className="text-foreground font-medium">{roleName.split('(')[0].trim()}</span>
          </p>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: 'sub-readability',
              label: 'Readability',
              value: readabilityScore,
              icon: 'EyeIcon',
            },
            { id: 'sub-format', label: 'Formatting', value: formatScore, icon: 'Squares2X2Icon' },
          ].map((sub) => (
            <div key={sub.id} className="bg-secondary/50 rounded-lg p-3 text-center">
              <Icon
                name={sub.icon as Parameters<typeof Icon>[0]['name']}
                size={14}
                className="text-muted-foreground mx-auto mb-1"
              />
              <p className="text-lg font-bold text-foreground tabular-nums">{sub.value}</p>
              <p className="text-[10px] text-muted-foreground">{sub.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Section Scores</h3>
        <div className="space-y-3">
          {sectionScores.map((section) => (
            <div key={section.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{section.name}</span>
                <span
                  className={`text-xs font-bold tabular-nums ${statusTextColor[section.status]}`}
                >
                  {section.score}/100
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${statusBarColor[section.status]} transition-all duration-700`}
                  style={{ width: `${section.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

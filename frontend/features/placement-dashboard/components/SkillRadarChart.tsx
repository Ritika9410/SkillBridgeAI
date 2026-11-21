'use client';

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { getPlannedSkills } from '../utils/resumePlan';
import { usePlacementData } from '../hooks/usePlacementData';

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-card-hover text-xs">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.name}`} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-foreground tabular-nums">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function SkillRadarChart() {
  const analysis = useResumeAnalysis();
  const { profile } = usePlacementData();
  const data = analysis
    ? getPlannedSkills(analysis, profile.skills).map(({ name, current, required }) => ({ domain: name, current, required }))
    : [];

  if (!analysis || !data.length) {
    return <div className="h-[260px] flex items-center justify-center text-center text-sm text-muted-foreground">Analyze a resume to compare your evidenced skills with role requirements.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius={90}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
        />
        <Radar
          name="Required"
          dataKey="required"
          stroke="var(--accent)"
          fill="var(--accent)"
          fillOpacity={0.08}
          strokeWidth={1.5}
          strokeDasharray="4 2"
        />
        <Radar
          name="Profile/resume"
          dataKey="current"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

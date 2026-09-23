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

const skillData = [
  { domain: 'DSA', current: 72, required: 90 },
  { domain: 'System Design', current: 45, required: 80 },
  { domain: 'Web Dev', current: 81, required: 75 },
  { domain: 'Databases', current: 63, required: 70 },
  { domain: 'OS Concepts', current: 55, required: 75 },
  { domain: 'Networking', current: 38, required: 65 },
];

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
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={skillData} outerRadius={90}>
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
          name="Current"
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

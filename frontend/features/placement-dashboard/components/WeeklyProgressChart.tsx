'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-card-hover text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">
        Readiness: <span className="text-primary font-bold tabular-nums">{payload[0]?.value}%</span>
      </p>
    </div>
  );
}

export default function WeeklyProgressChart() {
  const analysis = useResumeAnalysis();
  const weeklyData = (analysis?.history ?? []).map((entry) => ({
    week: new Date(entry.analyzedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: entry.score,
  }));
  const currentWeekIndex = weeklyData.length - 1;

  if (!weeklyData.length) {
    return <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">Your saved resume scores will appear here after analysis.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={weeklyData}
        barCategoryGap="30%"
        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
      >
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <ReferenceLine
          y={85}
          stroke="var(--positive)"
          strokeDasharray="4 2"
          strokeWidth={1}
          label={{ value: 'Target 85%', fill: 'var(--positive)', fontSize: 10, position: 'right' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {weeklyData.map((entry, index) => (
            <Cell
              key={`bar-cell-${entry.week}`}
              fill={index === currentWeekIndex ? 'var(--primary)' : 'var(--accent)'}
              fillOpacity={index === currentWeekIndex ? 1 : 0.5}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

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

const weeklyData = [
  { week: 'W1 Jun', score: 48, tasks: 2 },
  { week: 'W2 Jun', score: 52, tasks: 4 },
  { week: 'W3 Jun', score: 55, tasks: 3 },
  { week: 'W4 Jun', score: 51, tasks: 2 },
  { week: 'W1 Jul', score: 59, tasks: 5 },
  { week: 'W2 Jul', score: 65, tasks: 6 },
  { week: 'W3 Jul', score: 69, tasks: 5 },
  { week: 'W4 Jul', score: 72, tasks: 7 },
];

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
  const currentWeekIndex = weeklyData.length - 1;

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
          domain={[40, 80]}
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

'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface ATSGaugeChartProps {
  score: number;
}

export default function ATSGaugeChart({ score }: ATSGaugeChartProps) {
  const data = [{ name: 'score', value: score, fill: 'var(--primary)' }];

  return (
    <div className="relative w-36 h-36">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          startAngle={220}
          endAngle={-40}
          data={data}
          barSize={10}
        >
          <RadialBar
            background={{ fill: 'var(--secondary)' }}
            dataKey="value"
            cornerRadius={6}
            max={100}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground tabular-nums">{score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

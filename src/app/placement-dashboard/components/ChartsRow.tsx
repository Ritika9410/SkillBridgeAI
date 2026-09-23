'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';

const SkillRadarChart = dynamic(() => import('./SkillRadarChart'), { ssr: false });
const WeeklyProgressChart = dynamic(() => import('./WeeklyProgressChart'), { ssr: false });

export default function ChartsRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
      {/* Skill Radar — 2 cols */}
      <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Skill Coverage</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Across 6 core domains for SDE roles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Current</span>
            <span className="w-2 h-2 rounded-full bg-accent ml-2" />
            <span className="text-xs text-muted-foreground">Required</span>
          </div>
        </div>
        <SkillRadarChart />
      </div>

      {/* Weekly Progress — 3 cols */}
      <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Readiness Progression</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Overall readiness score over 8 weeks
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-positive font-medium">
            <Icon name="ArrowTrendingUpIcon" size={14} />
            +18% over 8 weeks
          </div>
        </div>
        <WeeklyProgressChart />
      </div>
    </div>
  );
}

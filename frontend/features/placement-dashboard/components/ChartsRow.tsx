'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';

const SkillRadarChart = dynamic(() => import('./SkillRadarChart'), { ssr: false });
const WeeklyProgressChart = dynamic(() => import('./WeeklyProgressChart'), { ssr: false });

export default function ChartsRow() {
  const analysis = useResumeAnalysis();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
      {/* Skill Radar — 2 cols */}
      <div
        id="skill-gap"
        className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 space-y-4 scroll-mt-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Role skill gap analysis</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {analysis
                ? `Extracted keyword coverage for ${analysis.roleName}`
                : 'Upload a resume to personalize this view'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Profile/resume</span>
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
            <h3 className="text-sm font-semibold text-foreground">Resume score history</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {analysis ? `${analysis.history?.length ?? 1} saved analysis${(analysis.history?.length ?? 1) === 1 ? '' : 'es'} · ${analysis.roleName}` : 'No saved resume scores yet'}
            </p>
          </div>
        </div>
        <WeeklyProgressChart />
      </div>
    </div>
  );
}

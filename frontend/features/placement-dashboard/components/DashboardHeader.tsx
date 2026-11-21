'use client';

import React from 'react';
import Icon from '@/frontend/components/ui/AppIcon';
import Badge from '@/frontend/components/ui/Badge';
import Link from 'next/link';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';

export default function DashboardHeader() {
  const analysis = useResumeAnalysis();
  const updatedAt = analysis ? new Date(analysis.analyzedAt).toLocaleString() : 'No resume analysis yet';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-foreground">Placement Dashboard</h1>
          <Badge variant={analysis ? 'info' : 'muted'}>{analysis ? analysis.roleName : 'Get started'}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {analysis ? `Latest resume analysis · ${updatedAt}` : 'Analyze a resume to populate your readiness data'}
          <span className="inline-flex items-center gap-1 ml-2">
            {analysis && <><span className="w-1.5 h-1.5 bg-positive rounded-full score-pulse" /><span className="text-positive text-xs font-medium">Saved</span></>}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/resume-analyzer"
          className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary/80 transition-all duration-150 active:scale-95"
        >
          <Icon name="DocumentTextIcon" size={16} className="text-muted-foreground" />
          Analyze Resume
        </Link>
        <Link
          href="/mock-interview"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all duration-150 active:scale-95"
        >
          <Icon name="PlayIcon" size={16} />
          Start Mock Interview
        </Link>
      </div>
    </div>
  );
}

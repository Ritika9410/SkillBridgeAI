import React from 'react';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-foreground">Placement Dashboard</h1>
          <Badge variant="warning">14 days to drive</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated · 27 Jul 2026, 05:50 AM
          <span className="inline-flex items-center gap-1 ml-2">
            <span className="w-1.5 h-1.5 bg-positive rounded-full score-pulse" />
            <span className="text-positive text-xs font-medium">Live</span>
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
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all duration-150 active:scale-95">
          <Icon name="PlayIcon" size={16} />
          Start Mock Interview
        </button>
      </div>
    </div>
  );
}

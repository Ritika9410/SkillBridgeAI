import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <Skeleton className="h-48" />
        </div>
        {[1, 2].map((i) => (
          <Skeleton key={`sk-hero-${i}`} className="h-48" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <MetricCardSkeleton key={`sk-metric-${i}`} />
        ))}
      </div>
    </div>
  );
}

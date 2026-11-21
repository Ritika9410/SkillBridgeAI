import React from 'react';
import Icon from '@/frontend/components/ui/AppIcon';
import type { KeywordGap } from '@/shared/types/analysisTypes';

interface KeywordAnalysisProps {
  matchedKeywords: string[];
  missingKeywords: KeywordGap[];
}

const importanceConfig: Record<string, { badge: string }> = {
  high: { badge: 'bg-[var(--negative-bg)] text-negative border-negative/20' },
  medium: { badge: 'bg-[var(--warning-bg)] text-warning border-warning/20' },
  low: { badge: 'bg-secondary text-muted-foreground border-border' },
};

export default function KeywordAnalysis({
  matchedKeywords,
  missingKeywords,
}: KeywordAnalysisProps) {
  const total = matchedKeywords.length + missingKeywords.length;
  const matchPct = total ? Math.round((matchedKeywords.length / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl border border-border">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Role Keyword Match</span>
            <span className="font-bold tabular-nums text-warning">{matchPct}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-warning rounded-full" style={{ width: `${matchPct}%` }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-foreground tabular-nums">
            {matchedKeywords.length}/{total}
          </p>
          <p className="text-[10px] text-muted-foreground">role terms found</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="CheckCircleIcon" size={16} className="text-positive" />
          <h4 className="text-sm font-semibold text-foreground">
            Matched Keywords{' '}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({matchedKeywords.length} found)
            </span>
          </h4>
        </div>
        {matchedKeywords.length ? (
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--positive-bg)] border border-positive/20 rounded-full text-xs font-medium text-positive"
              >
                <Icon name="CheckIcon" size={10} />
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No target-role terms were found in the extracted resume text.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="XCircleIcon" size={16} className="text-negative" />
          <h4 className="text-sm font-semibold text-foreground">
            Missing Keywords{' '}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({missingKeywords.length} not found)
            </span>
          </h4>
        </div>
        {missingKeywords.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {missingKeywords.map((item) => (
              <div
                key={item.keyword}
                className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-lg hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="PlusCircleIcon" size={14} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item.keyword}</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${importanceConfig[item.importance].badge}`}
                >
                  {item.importance}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-positive">All tracked keywords for this role were found.</p>
        )}
        <p className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3 border border-border">
          Only add a missing term if it accurately describes your skills or experience.
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import Icon from '@/components/ui/AppIcon';

const matchedKeywords = [
  'React.js',
  'JavaScript',
  'Python',
  'Node.js',
  'REST APIs',
  'Git',
  'MongoDB',
  'HTML/CSS',
  'TypeScript',
  'Agile',
  'MySQL',
  'Docker (basic)',
];

const missingKeywords = [
  { keyword: 'System Design', importance: 'high' },
  { keyword: 'Kubernetes', importance: 'medium' },
  { keyword: 'AWS / GCP', importance: 'high' },
  { keyword: 'Redis', importance: 'medium' },
  { keyword: 'GraphQL', importance: 'low' },
  { keyword: 'CI/CD Pipelines', importance: 'high' },
  { keyword: 'Microservices', importance: 'medium' },
  { keyword: 'Java / Spring Boot', importance: 'medium' },
];

const importanceConfig: Record<string, { badge: string; label: string }> = {
  high: {
    badge: 'bg-[var(--negative-bg)] text-negative border-negative/20',
    label: 'High priority',
  },
  medium: {
    badge: 'bg-[var(--warning-bg)] text-warning border-warning/20',
    label: 'Medium priority',
  },
  low: { badge: 'bg-secondary text-muted-foreground border-border', label: 'Low priority' },
};

export default function KeywordAnalysis() {
  const matchPct = Math.round(
    (matchedKeywords.length / (matchedKeywords.length + missingKeywords.length)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl border border-border">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Keyword Match Rate</span>
            <span className="font-bold tabular-nums text-warning">{matchPct}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-warning rounded-full" style={{ width: `${matchPct}%` }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-foreground tabular-nums">
            {matchedKeywords.length}/{matchedKeywords.length + missingKeywords.length}
          </p>
          <p className="text-[10px] text-muted-foreground">keywords found</p>
        </div>
      </div>

      {/* Matched Keywords */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="CheckCircleIcon" size={16} className="text-positive" />
          <h4 className="text-sm font-semibold text-foreground">
            Matched Keywords
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({matchedKeywords.length} found)
            </span>
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {matchedKeywords.map((kw) => (
            <span
              key={`matched-kw-${kw}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--positive-bg)] border border-positive/20 rounded-full text-xs font-medium text-positive"
            >
              <Icon name="CheckIcon" size={10} />
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="XCircleIcon" size={16} className="text-negative" />
          <h4 className="text-sm font-semibold text-foreground">
            Missing Keywords
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({missingKeywords.length} not found)
            </span>
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {missingKeywords.map((item) => {
            const config = importanceConfig[item.importance];
            return (
              <div
                key={`missing-kw-${item.keyword}`}
                className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-lg hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="PlusCircleIcon" size={14} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item.keyword}</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.badge}`}
                >
                  {item.importance}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3 border border-border">
          <span className="text-warning font-medium">Tip:</span> Add high-priority missing keywords
          to your Skills section and naturally incorporate them in your Experience descriptions.
        </p>
      </div>
    </div>
  );
}

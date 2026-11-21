'use client';

import React, { useState } from 'react';
import Icon from '@/frontend/components/ui/AppIcon';
import Badge from '@/frontend/components/ui/Badge';
import type { ResumeSuggestion } from '@/shared/types/analysisTypes';

interface ImprovementSuggestionsProps {
  suggestions: ResumeSuggestion[];
}

const priorityConfig: Record<
  ResumeSuggestion['priority'],
  { badge: 'negative' | 'warning' | 'info'; label: string }
> = {
  critical: { badge: 'negative', label: 'Critical' },
  high: { badge: 'warning', label: 'High' },
  medium: { badge: 'info', label: 'Medium' },
};

export default function ImprovementSuggestions({ suggestions }: ImprovementSuggestionsProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(suggestions[0] ? [suggestions[0].id] : [])
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <Icon name="LightBulbIcon" size={16} className="text-warning" />
          <span className="text-sm font-semibold text-foreground">
            {suggestions.length} resume-based suggestions
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Rule-based review</span>
      </div>

      {suggestions.length ? (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const config = priorityConfig[suggestion.priority];
            const expanded = expandedIds.has(suggestion.id);
            return (
              <div
                key={suggestion.id}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${suggestion.priority === 'critical' ? 'border-negative/30' : suggestion.priority === 'high' ? 'border-warning/20' : 'border-border'}`}
              >
                <button
                  onClick={() => toggleExpand(suggestion.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs font-bold text-muted-foreground flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{suggestion.title}</p>
                      <Badge variant={config.badge} size="sm">
                        {config.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                        {suggestion.section}
                      </span>
                    </div>
                    {!expanded && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {suggestion.description}
                      </p>
                    )}
                  </div>
                  <Icon
                    name={expanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                    size={16}
                    className="text-muted-foreground"
                  />
                </button>
                {expanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-4 fade-in">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {suggestion.description}
                    </p>
                    {suggestion.example && (
                      <div className="bg-secondary/70 rounded-lg p-3 border border-border">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                          Example
                        </p>
                        <p className="text-xs text-foreground font-mono leading-relaxed">
                          {suggestion.example}
                        </p>
                      </div>
                    )}
                    <p className="text-xs font-semibold text-accent">{suggestion.impact}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-positive p-4 bg-[var(--positive-bg)] rounded-lg">
          No specific improvements were detected by these checks.
        </p>
      )}
    </div>
  );
}

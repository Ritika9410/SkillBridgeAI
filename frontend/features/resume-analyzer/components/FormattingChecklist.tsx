'use client';

import React, { useState } from 'react';
import Icon from '@/frontend/components/ui/AppIcon';
import Badge from '@/frontend/components/ui/Badge';
import type { FormattingFinding } from '@/shared/types/analysisTypes';

const severityConfig = {
  error: {
    icon: 'XCircleIcon',
    color: 'text-negative',
    bg: 'bg-[var(--negative-bg)]',
    border: 'border-negative/20',
    badge: 'negative' as const,
    label: 'Issue',
  },
  warning: {
    icon: 'ExclamationTriangleIcon',
    color: 'text-warning',
    bg: 'bg-[var(--warning-bg)]',
    border: 'border-warning/20',
    badge: 'warning' as const,
    label: 'Review',
  },
  pass: {
    icon: 'CheckCircleIcon',
    color: 'text-positive',
    bg: 'bg-[var(--positive-bg)]',
    border: 'border-positive/20',
    badge: 'positive' as const,
    label: 'Pass',
  },
};

export default function FormattingChecklist({ items }: { items: FormattingFinding[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null);
  const errors = items.filter((item) => item.severity === 'error').length;
  const warnings = items.filter((item) => item.severity === 'warning').length;
  const passes = items.filter((item) => item.severity === 'pass').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            id: 'fmt-errors',
            label: 'Issues',
            count: errors,
            color: 'text-negative',
            bg: 'bg-[var(--negative-bg)] border-negative/20',
          },
          {
            id: 'fmt-warnings',
            label: 'Review',
            count: warnings,
            color: 'text-warning',
            bg: 'bg-[var(--warning-bg)] border-warning/20',
          },
          {
            id: 'fmt-passes',
            label: 'Passed',
            count: passes,
            color: 'text-positive',
            bg: 'bg-[var(--positive-bg)] border-positive/20',
          },
        ].map((stat) => (
          <div key={stat.id} className={`${stat.bg} border rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const config = severityConfig[item.severity];
          const expanded = expandedId === item.id;
          return (
            <div key={item.id} className={`border rounded-xl overflow-hidden ${config.border}`}>
              <button
                onClick={() => setExpandedId(expanded ? null : item.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-secondary/20 transition-colors"
              >
                <div
                  className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon
                    name={config.icon as Parameters<typeof Icon>[0]['name']}
                    size={15}
                    className={config.color}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-foreground">{item.issue}</p>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                      {item.category}
                    </span>
                  </div>
                </div>
                <Badge variant={config.badge} size="sm">
                  {config.label}
                </Badge>
                <Icon
                  name={expanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                  size={14}
                  className="text-muted-foreground"
                />
              </button>
              {expanded && (
                <div className="px-4 pb-4 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Formatting checks use extracted text and page count; they cannot reliably detect visual
        columns, fonts, or image placement.
      </p>
    </div>
  );
}

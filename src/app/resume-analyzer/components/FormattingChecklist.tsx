'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';

interface ChecklistItem {
  id: string;
  category: string;
  issue: string;
  description: string;
  severity: 'error' | 'warning' | 'pass';
  fixable: boolean;
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'fmt-001',
    category: 'Layout',
    issue: 'Multi-column layout detected',
    description:
      'Your resume uses a two-column layout. Many ATS parsers read left-to-right and may mix up columns, resulting in scrambled content. Switch to a single-column layout.',
    severity: 'error',
    fixable: true,
  },
  {
    id: 'fmt-002',
    category: 'Fonts',
    issue: 'Non-standard font detected',
    description:
      'The font "Garamond" is used in your resume. ATS systems may not render it correctly. Use standard fonts: Arial, Calibri, Times New Roman, or Georgia.',
    severity: 'warning',
    fixable: true,
  },
  {
    id: 'fmt-003',
    category: 'Images',
    issue: 'Profile photo detected',
    description:
      'A profile photo is embedded in your resume. ATS systems cannot parse images and some companies explicitly reject resumes with photos to avoid bias. Remove it.',
    severity: 'error',
    fixable: true,
  },
  {
    id: 'fmt-004',
    category: 'File',
    issue: 'PDF is text-selectable',
    description:
      'Your PDF text is selectable and parseable — this is correct. ATS systems can extract content without issues.',
    severity: 'pass',
    fixable: false,
  },
  {
    id: 'fmt-005',
    category: 'Structure',
    issue: 'Standard section headings used',
    description:
      'Your section headings (Education, Experience, Skills, Projects) match expected ATS patterns. No issues detected.',
    severity: 'pass',
    fixable: false,
  },
  {
    id: 'fmt-006',
    category: 'Length',
    issue: 'Resume length is appropriate',
    description:
      'Your resume is 1 page — ideal for students and fresh graduates. No length issues.',
    severity: 'pass',
    fixable: false,
  },
  {
    id: 'fmt-007',
    category: 'Spacing',
    issue: 'Inconsistent line spacing detected',
    description:
      'Line spacing varies between sections (1.0 in Experience, 1.15 in Education). Standardize to 1.15 throughout for a cleaner parse.',
    severity: 'warning',
    fixable: true,
  },
];

const severityConfig: Record<
  ChecklistItem['severity'],
  {
    icon: string;
    iconColor: string;
    bg: string;
    border: string;
    badge: 'negative' | 'warning' | 'positive';
    label: string;
  }
> = {
  error: {
    icon: 'XCircleIcon',
    iconColor: 'text-negative',
    bg: 'bg-[var(--negative-bg)]',
    border: 'border-negative/20',
    badge: 'negative',
    label: 'Error',
  },
  warning: {
    icon: 'ExclamationTriangleIcon',
    iconColor: 'text-warning',
    bg: 'bg-[var(--warning-bg)]',
    border: 'border-warning/20',
    badge: 'warning',
    label: 'Warning',
  },
  pass: {
    icon: 'CheckCircleIcon',
    iconColor: 'text-positive',
    bg: 'bg-[var(--positive-bg)]',
    border: 'border-positive/20',
    badge: 'positive',
    label: 'Pass',
  },
};

export default function FormattingChecklist() {
  const [expandedId, setExpandedId] = useState<string | null>('fmt-001');

  const errors = checklistItems.filter((i) => i.severity === 'error').length;
  const warnings = checklistItems.filter((i) => i.severity === 'warning').length;
  const passes = checklistItems.filter((i) => i.severity === 'pass').length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            id: 'fmt-sum-errors',
            label: 'Errors',
            count: errors,
            color: 'text-negative',
            bg: 'bg-[var(--negative-bg)] border-negative/20',
          },
          {
            id: 'fmt-sum-warnings',
            label: 'Warnings',
            count: warnings,
            color: 'text-warning',
            bg: 'bg-[var(--warning-bg)] border-warning/20',
          },
          {
            id: 'fmt-sum-passes',
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

      {/* Checklist */}
      <div className="space-y-2">
        {checklistItems.map((item) => {
          const config = severityConfig[item.severity];
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${config.border}`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-secondary/20 transition-colors"
              >
                <div
                  className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon
                    name={config.icon as Parameters<typeof Icon>[0]['name']}
                    size={15}
                    className={config.iconColor}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{item.issue}</p>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={config.badge} size="sm">
                    {config.label}
                  </Badge>
                  {item.severity !== 'pass' && (
                    <Icon
                      name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                      size={14}
                      className="text-muted-foreground"
                    />
                  )}
                </div>
              </button>

              {isExpanded && item.severity !== 'pass' && (
                <div className="px-4 pb-4 pt-3 border-t border-border space-y-3 fade-in">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  {item.fixable && (
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                      <Icon name="WrenchScrewdriverIcon" size={13} />
                      View fix guide
                    </button>
                  )}
                </div>
              )}

              {isExpanded && item.severity === 'pass' && (
                <div className="px-4 pb-3 pt-2 border-t border-border fade-in">
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

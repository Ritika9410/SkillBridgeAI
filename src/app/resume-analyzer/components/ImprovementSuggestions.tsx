'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';

interface Suggestion {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  section: string;
  title: string;
  description: string;
  example?: string;
  impact: string;
  expanded?: boolean;
}

const suggestions: Suggestion[] = [
  {
    id: 'sug-001',
    priority: 'critical',
    section: 'Professional Summary',
    title: 'Add a targeted professional summary',
    description:
      'Your resume is missing a professional summary section. ATS systems and recruiters use the summary to quickly understand your profile. A 3–4 line summary with your role, years of experience, and top 2–3 skills significantly improves ATS parsing.',
    example:
      '"Final-year B.Tech CSE student at NITK with hands-on experience in full-stack development (React.js, Node.js) and a strong foundation in DSA. Seeking SDE role to contribute to scalable backend systems."',
    impact: '+12 ATS points',
  },
  {
    id: 'sug-002',
    priority: 'critical',
    section: 'Work Experience',
    title: 'Quantify your internship achievements',
    description:
      'Your experience bullet points use vague language ("worked on", "helped with"). ATS systems and human reviewers rank resumes higher when bullet points contain measurable outcomes. Replace vague verbs with action verbs + quantified results.',
    example:
      '"Reduced API response time by 34% by implementing Redis caching for the product catalog service, handling 10K+ daily requests."',
    impact: '+9 ATS points',
  },
  {
    id: 'sug-003',
    priority: 'high',
    section: 'Technical Skills',
    title: 'Restructure skills section with categories',
    description:
      'Your skills are listed as a flat comma-separated list. Grouping skills into categories (Languages, Frameworks, Databases, Tools) helps ATS parsers correctly extract and match each skill to job requirements.',
    example:
      'Languages: Python, JavaScript, Java | Frameworks: React.js, Node.js, Express | Databases: MongoDB, MySQL',
    impact: '+7 ATS points',
  },
  {
    id: 'sug-004',
    priority: 'high',
    section: 'Projects',
    title: 'Add tech stack tags to each project',
    description:
      'Project entries lack explicit technology mentions in a parseable format. Add a "Tech Stack:" line under each project with the exact technology names used. Many ATS systems specifically look for this pattern.',
    example: 'Tech Stack: React.js, Node.js, MongoDB, JWT Authentication, Deployed on Vercel',
    impact: '+6 ATS points',
  },
  {
    id: 'sug-005',
    priority: 'medium',
    section: 'Education',
    title: 'Include CGPA if above 7.0',
    description:
      'Your CGPA is not listed in the education section. Most campus recruitment drives filter by CGPA cutoff (typically 6.5–7.0). Including your CGPA (8.2) signals academic strength and passes automated filters.',
    impact: '+4 ATS points',
  },
  {
    id: 'sug-006',
    priority: 'low',
    section: 'Contact Info',
    title: 'Add LinkedIn and GitHub profile links',
    description:
      'Your contact section has email and phone but no LinkedIn or GitHub URLs. For tech roles, these are expected. Recruiters frequently visit GitHub to assess code quality before interviews.',
    impact: '+3 ATS points',
  },
];

const priorityConfig: Record<
  Suggestion['priority'],
  {
    badge: 'negative' | 'warning' | 'info' | 'muted';
    label: string;
    dot: string;
  }
> = {
  critical: { badge: 'negative', label: 'Critical', dot: 'bg-negative' },
  high: { badge: 'warning', label: 'High', dot: 'bg-warning' },
  medium: { badge: 'info', label: 'Medium', dot: 'bg-accent' },
  low: { badge: 'muted', label: 'Low', dot: 'bg-muted-foreground' },
};

export default function ImprovementSuggestions() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['sug-001']));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalImpact = '+41 ATS points potential';

  return (
    <div className="space-y-4">
      {/* Header summary */}
      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <Icon name="LightBulbIcon" size={16} className="text-warning" />
          <span className="text-sm font-semibold text-foreground">
            {suggestions.length} AI suggestions found
          </span>
        </div>
        <span className="text-xs font-bold text-positive">{totalImpact}</span>
      </div>

      {/* Suggestions list */}
      <div className="space-y-3">
        {suggestions.map((sug, index) => {
          const config = priorityConfig[sug.priority];
          const isExpanded = expandedIds.has(sug.id);

          return (
            <div
              key={sug.id}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                sug.priority === 'critical'
                  ? 'border-negative/30'
                  : sug.priority === 'high'
                    ? 'border-warning/20'
                    : 'border-border'
              }`}
            >
              <button
                onClick={() => toggleExpand(sug.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs font-bold text-muted-foreground flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{sug.title}</p>
                    <Badge variant={config.badge} size="sm">
                      {config.label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                      {sug.section}
                    </span>
                  </div>
                  {!isExpanded && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {sug.description.slice(0, 80)}...
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-bold text-positive hidden sm:block">
                    {sug.impact}
                  </span>
                  <Icon
                    name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                    size={16}
                    className="text-muted-foreground"
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-4 fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed">{sug.description}</p>

                  {sug.example && (
                    <div className="bg-secondary/70 rounded-lg p-3 border border-border">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                        Example
                      </p>
                      <p className="text-xs text-foreground font-mono leading-relaxed">
                        {sug.example}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon name="BoltIcon" size={13} className="text-positive" />
                      <span className="text-xs font-semibold text-positive">
                        Estimated impact: {sug.impact}
                      </span>
                    </div>
                    <button className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
                      Apply suggestion →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

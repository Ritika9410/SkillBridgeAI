import React from 'react';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';

interface CompanyMatch {
  id: string;
  name: string;
  role: string;
  matchPct: number;
  missingSkills: string[];
  ctc: string;
  deadline: string;
  status: 'good' | 'moderate' | 'low';
}

const companies: CompanyMatch[] = [
  {
    id: 'company-001',
    name: 'Infosys',
    role: 'Systems Engineer',
    matchPct: 88,
    missingSkills: ['Spring Boot'],
    ctc: '₹6.5 LPA',
    deadline: '10 Aug 2026',
    status: 'good',
  },
  {
    id: 'company-002',
    name: 'Flipkart',
    role: 'SDE-1',
    matchPct: 71,
    missingSkills: ['System Design', 'Kafka'],
    ctc: '₹18 LPA',
    deadline: '22 Aug 2026',
    status: 'moderate',
  },
  {
    id: 'company-003',
    name: 'Goldman Sachs',
    role: 'Analyst - Technology',
    matchPct: 54,
    missingSkills: ['Networking', 'OS', 'C++'],
    ctc: '₹22 LPA',
    deadline: '05 Sep 2026',
    status: 'low',
  },
];

const statusConfig: Record<
  CompanyMatch['status'],
  {
    bar: string;
    badge: 'positive' | 'warning' | 'negative';
    label: string;
  }
> = {
  good: { bar: 'bg-positive', badge: 'positive', label: 'Good Fit' },
  moderate: { bar: 'bg-warning', badge: 'warning', label: 'Moderate' },
  low: { bar: 'bg-negative', badge: 'negative', label: 'Needs Work' },
};

export default function CompanyMatchPanel() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Target Company Match</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on your current skill profile
          </p>
        </div>
        <button className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
          Add company
        </button>
      </div>

      <div className="space-y-4">
        {companies.map((company) => {
          const config = statusConfig[company.status];
          return (
            <div
              key={company.id}
              className="p-3 rounded-xl border border-border hover:border-primary/20 hover:bg-secondary/30 transition-all duration-150 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon name="BuildingOffice2Icon" size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{company.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {company.role} · {company.ctc}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold tabular-nums ${
                      company.status === 'good'
                        ? 'text-positive'
                        : company.status === 'moderate'
                          ? 'text-warning'
                          : 'text-negative'
                    }`}
                  >
                    {company.matchPct}%
                  </p>
                  <Badge variant={config.badge} size="sm">
                    {config.label}
                  </Badge>
                </div>
              </div>

              {/* Match bar */}
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${config.bar} transition-all duration-700`}
                  style={{ width: `${company.matchPct}%` }}
                />
              </div>

              {/* Missing skills */}
              {company.missingSkills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-muted-foreground">Missing:</span>
                  {company.missingSkills.map((skill) => (
                    <span
                      key={`${company.id}-skill-${skill}`}
                      className="text-[10px] bg-secondary border border-border rounded-full px-2 py-0.5 text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Icon name="CalendarIcon" size={11} />
                Drive: {company.deadline}
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full py-2 text-xs font-semibold text-accent hover:text-accent/80 border border-accent/20 rounded-lg hover:bg-accent/5 transition-all duration-150">
        View all 12 companies →
      </button>
    </div>
  );
}

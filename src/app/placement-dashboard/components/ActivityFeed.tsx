import React from 'react';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';

interface ActivityItem {
  id: string;
  type: 'resume' | 'interview' | 'skill' | 'roadmap' | 'profile';
  title: string;
  detail: string;
  time: string;
  badge?: { text: string; variant: 'positive' | 'negative' | 'warning' | 'info' | 'muted' };
}

const activities: ActivityItem[] = [
  {
    id: 'act-001',
    type: 'resume',
    title: 'Resume analyzed',
    detail: 'ATS Score improved from 66 → 74',
    time: '2h ago',
    badge: { text: '+8 pts', variant: 'positive' },
  },
  {
    id: 'act-002',
    type: 'interview',
    title: 'Mock Interview completed',
    detail: 'DSA round — 61/100 · Needs improvement',
    time: '5h ago',
    badge: { text: '61/100', variant: 'warning' },
  },
  {
    id: 'act-003',
    type: 'skill',
    title: 'Skill gap updated',
    detail: 'React.js added to your profile · match +4%',
    time: '1d ago',
    badge: { text: '+4%', variant: 'positive' },
  },
  {
    id: 'act-004',
    type: 'roadmap',
    title: 'Roadmap task completed',
    detail: 'SQL Window Functions — HackerRank 5/5',
    time: '1d ago',
  },
  {
    id: 'act-005',
    type: 'profile',
    title: 'Profile updated',
    detail: 'Added Internship: Groww — Summer 2025',
    time: '2d ago',
    badge: { text: '+3% complete', variant: 'info' },
  },
  {
    id: 'act-006',
    type: 'interview',
    title: 'Mock Interview completed',
    detail: 'Behavioral round — 65/100',
    time: '3d ago',
    badge: { text: '65/100', variant: 'warning' },
  },
];

const typeConfig: Record<ActivityItem['type'], { icon: string; color: string; bg: string }> = {
  resume: { icon: 'DocumentTextIcon', color: 'text-accent', bg: 'bg-[var(--info-bg)]' },
  interview: {
    icon: 'ChatBubbleLeftRightIcon',
    color: 'text-warning',
    bg: 'bg-[var(--warning-bg)]',
  },
  skill: { icon: 'PuzzlePieceIcon', color: 'text-positive', bg: 'bg-[var(--positive-bg)]' },
  roadmap: { icon: 'MapIcon', color: 'text-primary', bg: 'bg-primary/10' },
  profile: { icon: 'UserCircleIcon', color: 'text-muted-foreground', bg: 'bg-secondary' },
};

export default function ActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your last 6 actions</p>
        </div>
        <button className="text-xs text-accent hover:text-accent/80 font-medium transition-colors">
          View all
        </button>
      </div>

      <ul className="space-y-3">
        {activities.map((item) => {
          const config = typeConfig[item.type];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <Icon
                  name={config.icon as Parameters<typeof Icon>[0]['name']}
                  size={15}
                  className={config.color}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  {item.detail}
                </p>
                {item.badge && (
                  <div className="mt-1">
                    <Badge variant={item.badge.variant} size="sm">
                      {item.badge.text}
                    </Badge>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

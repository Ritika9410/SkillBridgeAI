'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';

interface Task {
  id: string;
  title: string;
  category: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const initialTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Solve 5 LeetCode Medium DP problems',
    category: 'DSA',
    duration: '2h',
    priority: 'high',
    completed: true,
  },
  {
    id: 'task-002',
    title: 'Complete System Design: Load Balancers',
    category: 'System Design',
    duration: '1.5h',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-003',
    title: 'Read OS: Process Scheduling chapter',
    category: 'OS Concepts',
    duration: '45m',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'task-004',
    title: 'Practice SQL window functions (HackerRank)',
    category: 'Databases',
    duration: '1h',
    priority: 'medium',
    completed: true,
  },
  {
    id: 'task-005',
    title: 'Update resume with latest internship project',
    category: 'Resume',
    duration: '30m',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-006',
    title: 'Study TCP/IP and DNS fundamentals',
    category: 'Networking',
    duration: '1h',
    priority: 'low',
    completed: false,
  },
  {
    id: 'task-007',
    title: 'Mock interview: Behavioral questions round',
    category: 'Interview',
    duration: '45m',
    priority: 'medium',
    completed: false,
  },
];

const priorityBadge: Record<string, 'negative' | 'warning' | 'muted'> = {
  high: 'negative',
  medium: 'warning',
  low: 'muted',
};

const categoryColor: Record<string, string> = {
  DSA: 'text-primary',
  'System Design': 'text-accent',
  'OS Concepts': 'text-warning',
  Databases: 'text-positive',
  Resume: 'text-negative',
  Networking: 'text-muted-foreground',
  Interview: 'text-accent',
};

export default function RoadmapTaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">This Week&apos;s Roadmap</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedCount}/{tasks.length} tasks completed
          </p>
        </div>
        <Badge variant="info">{Math.round((completedCount / tasks.length) * 100)}%</Badge>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / tasks.length) * 100}%` }}
        />
      </div>

      {/* Tasks */}
      <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-150 cursor-pointer group
              ${
                task.completed
                  ? 'border-transparent bg-secondary/30 opacity-60'
                  : 'border-border hover:border-primary/20 hover:bg-secondary/50'
              }`}
            onClick={() => toggleTask(task.id)}
          >
            <div
              className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-150
              ${task.completed ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`}
            >
              {task.completed && (
                <Icon name="CheckIcon" size={10} className="text-primary-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs font-medium leading-tight ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-semibold ${categoryColor[task.category] || 'text-muted-foreground'}`}
                >
                  {task.category}
                </span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">{task.duration}</span>
              </div>
            </div>
            <Badge variant={priorityBadge[task.priority]} size="sm">
              {task.priority}
            </Badge>
          </li>
        ))}
      </ul>

      <button className="w-full py-2 text-xs font-semibold text-accent hover:text-accent/80 border border-accent/20 rounded-lg hover:bg-accent/5 transition-all duration-150">
        View Full Roadmap →
      </button>
    </div>
  );
}

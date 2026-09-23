'use client';

import React, { useState } from 'react';
import KeywordAnalysis from './KeywordAnalysis';
import ImprovementSuggestions from './ImprovementSuggestions';
import FormattingChecklist from './FormattingChecklist';
import Icon from '@/components/ui/AppIcon';

type ResultTab = 'keywords' | 'suggestions' | 'formatting';

const tabs: { id: ResultTab; label: string; icon: string; badge?: number }[] = [
  { id: 'keywords', label: 'Keyword Analysis', icon: 'TagIcon', badge: 8 },
  { id: 'suggestions', label: 'AI Suggestions', icon: 'LightBulbIcon', badge: 6 },
  { id: 'formatting', label: 'Formatting Issues', icon: 'ExclamationTriangleIcon', badge: 3 },
];

export default function AnalysisResults() {
  const [activeTab, setActiveTab] = useState<ResultTab>('keywords');

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={`result-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all duration-150 relative
              ${
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
              }
            `}
          >
            <Icon name={tab.icon as Parameters<typeof Icon>[0]['name']} size={15} />
            {tab.label}
            {tab.badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 fade-in">
        {activeTab === 'keywords' && <KeywordAnalysis />}
        {activeTab === 'suggestions' && <ImprovementSuggestions />}
        {activeTab === 'formatting' && <FormattingChecklist />}
      </div>
    </div>
  );
}

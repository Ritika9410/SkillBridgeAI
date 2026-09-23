import React from 'react';
import RoadmapTaskList from './RoadmapTaskList';
import ActivityFeed from './ActivityFeed';
import CompanyMatchPanel from './CompanyMatchPanel';

export default function BottomRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      <RoadmapTaskList />
      <ActivityFeed />
      <CompanyMatchPanel />
    </div>
  );
}

import React from 'react';
import RoadmapTaskList from './RoadmapTaskList';
import ActivityFeed from './ActivityFeed';

export default function BottomRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <RoadmapTaskList />
      <ActivityFeed />
    </div>
  );
}

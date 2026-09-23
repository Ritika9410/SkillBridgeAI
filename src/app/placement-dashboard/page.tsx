import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from './components/DashboardHeader';
import ReadinessBentoGrid from './components/ReadinessBentoGrid';
import ChartsRow from './components/ChartsRow';
import BottomRow from './components/BottomRow';

export default function PlacementDashboardPage() {
  return (
    <AppLayout activePath="/placement-dashboard">
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 space-y-6">
          <DashboardHeader />
          <ReadinessBentoGrid />
          <ChartsRow />
          <BottomRow />
        </div>
      </div>
    </AppLayout>
  );
}

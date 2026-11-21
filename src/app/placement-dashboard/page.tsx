import React from 'react';
import AppLayout from '@/frontend/components/AppLayout';
import DashboardHeader from '@/frontend/features/placement-dashboard/components/DashboardHeader';
import ReadinessBentoGrid from '@/frontend/features/placement-dashboard/components/ReadinessBentoGrid';
import ChartsRow from '@/frontend/features/placement-dashboard/components/ChartsRow';
import BottomRow from '@/frontend/features/placement-dashboard/components/BottomRow';
import CareerRecommendations from '@/frontend/features/placement-dashboard/components/CareerRecommendations';
import { requireSessionUser } from '@/server/auth';

export default async function PlacementDashboardPage() {
  await requireSessionUser();
  return (
    <AppLayout activePath="/placement-dashboard">
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 space-y-6">
          <DashboardHeader />
          <ReadinessBentoGrid />
          <ChartsRow />
          <CareerRecommendations />
          <BottomRow />
        </div>
      </div>
    </AppLayout>
  );
}

import AppLayout from '@/components/AppLayout';
import BottomRow from './placement-dashboard/components/BottomRow';
import ChartsRow from './placement-dashboard/components/ChartsRow';
import DashboardHeader from './placement-dashboard/components/DashboardHeader';
import ReadinessBentoGrid from './placement-dashboard/components/ReadinessBentoGrid';

export default function HomePage() {
  return (
    <AppLayout activePath="/placement-dashboard">
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-8 lg:px-8 xl:px-10 2xl:px-12">
          <DashboardHeader />
          <ReadinessBentoGrid />
          <ChartsRow />
          <BottomRow />
        </div>
      </div>
    </AppLayout>
  );
}

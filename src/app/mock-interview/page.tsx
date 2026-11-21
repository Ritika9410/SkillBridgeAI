import AppLayout from '@/frontend/components/AppLayout';
import MockInterviewScreen from '@/frontend/features/interviews/MockInterviewScreen';
import { requireSessionUser } from '@/server/auth';

export default async function MockInterviewPage() {
  await requireSessionUser();
  return (
    <AppLayout activePath="/mock-interview">
      <div className="min-h-screen bg-background px-6 lg:px-8 py-8">
        <MockInterviewScreen />
      </div>
    </AppLayout>
  );
}

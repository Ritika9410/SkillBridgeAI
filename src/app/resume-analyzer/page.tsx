import AppLayout from '@/frontend/components/AppLayout';
import ResumeAnalyzerScreen from '@/frontend/features/resume-analyzer/components/ResumeAnalyzerScreen';
import { requireSessionUser } from '@/server/auth';

export default async function ResumeAnalyzerPage() {
  await requireSessionUser();
  return (
    <AppLayout activePath="/resume-analyzer">
      <ResumeAnalyzerScreen />
    </AppLayout>
  );
}

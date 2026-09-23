import AppLayout from '@/components/AppLayout';
import ResumeAnalyzerScreen from './components/ResumeAnalyzerScreen';

export default function ResumeAnalyzerPage() {
  return (
    <AppLayout activePath="/resume-analyzer">
      <ResumeAnalyzerScreen />
    </AppLayout>
  );
}

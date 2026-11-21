import AppLayout from '@/frontend/components/AppLayout';
import ProfileScreen from '@/frontend/features/profile/ProfileScreen';
import { requireSessionUser } from '@/server/auth';

export default async function ProfilePage() {
  await requireSessionUser();
  return (
    <AppLayout activePath="/profile">
      <div className="min-h-screen bg-background px-6 lg:px-8 py-8">
        <ProfileScreen />
      </div>
    </AppLayout>
  );
}

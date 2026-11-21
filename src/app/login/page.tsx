import { redirect } from 'next/navigation';
import AuthScreen from '@/frontend/features/auth/AuthScreen';
import { getSessionUser } from '@/server/auth';

export default async function LoginPage() {
  if (await getSessionUser()) redirect('/placement-dashboard');
  return <AuthScreen />;
}

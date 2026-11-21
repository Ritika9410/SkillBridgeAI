import type { Metadata } from 'next';
import '@/frontend/styles/index.css';

export const metadata: Metadata = {
  title: 'SkillBridge AI',
  description: 'Your placement-readiness companion',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

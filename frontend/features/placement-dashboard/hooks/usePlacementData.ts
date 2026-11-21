'use client';

import { useCallback, useEffect, useState } from 'react';
import type { InterviewSession, RoadmapPlan, StudentProfile } from '@/shared/types/analysisTypes';
import { emptyStudentProfile } from '@/shared/profileUtils';

export function usePlacementData() {
  const [profile, setProfile] = useState<StudentProfile>(emptyStudentProfile());
  const [roadmap, setRoadmap] = useState<RoadmapPlan | null>(null);
  const [latestInterview, setLatestInterview] = useState<InterviewSession | null>(null);

  const refresh = useCallback(async () => {
    const [profileResponse, roadmapResponse, interviewResponse] = await Promise.all([
      fetch('/api/profile', { cache: 'no-store' }),
      fetch('/api/roadmap', { cache: 'no-store' }),
      fetch('/api/interviews', { cache: 'no-store' }),
    ]);
    if (profileResponse.ok) {
      const data = await profileResponse.json();
      setProfile({ ...emptyStudentProfile(), ...data.profile });
    }
    if (roadmapResponse.ok) {
      const data = await roadmapResponse.json();
      setRoadmap(data.plan ?? null);
    }
    if (interviewResponse.ok) {
      const data = await interviewResponse.json();
      const completed = (data.sessions as InterviewSession[]).filter((session) => session.status === 'completed');
      setLatestInterview(completed[0] ?? null);
    }
  }, []);

  useEffect(() => {
    void refresh().catch(() => undefined);
    const events = ['skillbridge:profile-updated', 'skillbridge:roadmap-updated', 'skillbridge:interview-updated'];
    events.forEach((event) => window.addEventListener(event, refresh));
    return () => events.forEach((event) => window.removeEventListener(event, refresh));
  }, [refresh]);

  return { profile, roadmap, latestInterview };
}

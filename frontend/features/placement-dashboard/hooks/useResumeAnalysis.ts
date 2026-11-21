'use client';

import { useEffect, useState } from 'react';
import {
  RESUME_ANALYSIS_UPDATED_EVENT,
  type ResumeAnalysisSummary,
} from '../utils/resumePlan';
export function notifyResumeAnalysisSaved(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(RESUME_ANALYSIS_UPDATED_EVENT));
}

export function useResumeAnalysis(): ResumeAnalysisSummary | null {
  const [analysis, setAnalysis] = useState<ResumeAnalysisSummary | null>(null);

  useEffect(() => {
    let active = true;
    const readAnalysis = async () => {
      try {
        const response = await fetch('/api/resume/latest', { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not load resume analysis');
        const payload = (await response.json()) as { analysis: ResumeAnalysisSummary | null };
        if (active) setAnalysis(payload.analysis);
      } catch {
        if (active) setAnalysis(null);
      }
    };

    void readAnalysis();
    window.addEventListener('focus', readAnalysis);
    window.addEventListener(RESUME_ANALYSIS_UPDATED_EVENT, readAnalysis);
    return () => {
      active = false;
      window.removeEventListener('focus', readAnalysis);
      window.removeEventListener(RESUME_ANALYSIS_UPDATED_EVENT, readAnalysis);
    };
  }, []);

  return analysis;
}

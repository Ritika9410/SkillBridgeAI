export const RESUME_ANALYSIS_UPDATED_EVENT = 'skillbridge:resume-analysis-updated';

export interface ResumeAnalysisSummary {
  fileName: string;
  fingerprint: string;
  roleId: string;
  roleName: string;
  score: number;
  roleFitScore?: number;
  readabilityScore?: number;
  formattingScore?: number;
  pageCount?: number;
  analyzedAt: string;
  matchedKeywords: string[];
  missingKeywords: { keyword: string; importance: 'high' | 'medium' | 'low' }[];
  history?: { analyzedAt: string; score: number }[];
}

export interface PlannedSkill {
  name: string;
  current: number;
  required: number;
  gap: number;
}

export function getPlannedSkills(
  analysis: ResumeAnalysisSummary,
  profileSkills: string[] = []
): PlannedSkill[] {
  const present = new Set(
    [...analysis.matchedKeywords, ...profileSkills].map((keyword) => keyword.toLowerCase())
  );
  const unique = new Map<string, { keyword: string; importance: 'high' | 'medium' | 'low' }>();
  analysis.missingKeywords.forEach((item) => unique.set(item.keyword.toLowerCase(), item));
  analysis.matchedKeywords.forEach((keyword) =>
    unique.set(keyword.toLowerCase(), { keyword, importance: 'low' })
  );
  return [...unique.values()]
    .map((item) => ({
      name: item.keyword,
      current: present.has(item.keyword.toLowerCase()) ? 100 : 0,
      required: 100,
      gap: present.has(item.keyword.toLowerCase()) ? 0 : 100,
    }))
    .sort((a, b) => b.gap - a.gap);
}

export type KeywordPriority = 'high' | 'medium' | 'low';
export type SuggestionPriority = 'critical' | 'high' | 'medium';
export type FormattingSeverity = 'error' | 'warning' | 'pass';

export interface KeywordGap {
  keyword: string;
  importance: KeywordPriority;
}

export interface ResumeSuggestion {
  id: string;
  priority: SuggestionPriority;
  section: string;
  title: string;
  description: string;
  example?: string;
  impact: string;
}

export interface FormattingFinding {
  id: string;
  category: string;
  issue: string;
  description: string;
  severity: FormattingSeverity;
  fixable: boolean;
}

export interface ResumeAnalysisResult {
  fileName: string;
  fingerprint: string;
  roleId: string;
  roleName: string;
  score: number;
  /** Role-specific evidence score returned by AI. Older database records may not include it. */
  roleFitScore: number;
  readabilityScore: number;
  formattingScore: number;
  pageCount: number;
  matchedKeywords: string[];
  missingKeywords: KeywordGap[];
  suggestions: ResumeSuggestion[];
  formattingFindings: FormattingFinding[];
  sectionScores: { id: string; name: string; score: number }[];
  analyzedAt: string;
}

export interface StudentProfile {
  fullName: string;
  college: string;
  branch: string;
  year: string;
  cgpa: string;
  skills: string[];
  projects: { name: string; description: string; technologies: string[] }[];
  certifications: string[];
  github: string;
  linkedin: string;
  updatedAt?: string;
}

export interface RoadmapTask {
  id: string;
  week: number;
  title: string;
  skill: string;
  description: string;
  estimatedHours: number;
  completed: boolean;
}

export interface RoadmapPlan {
  roleName: string;
  analysisFingerprint: string;
  generatedAt: string;
  tasks: RoadmapTask[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer?: string;
  feedback?: string;
  communicationScore?: number;
  technicalScore?: number;
  confidenceScore?: number;
}

export interface InterviewSession {
  id: string;
  roleName: string;
  status: 'in_progress' | 'completed';
  questions: InterviewQuestion[];
  score: number | null;
  createdAt: string;
  completedAt?: string;
}

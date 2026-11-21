'use client';

import Link from 'next/link';
import Badge from '@/frontend/components/ui/Badge';
import Icon from '@/frontend/components/ui/AppIcon';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { getPlannedSkills } from '../utils/resumePlan';
import { usePlacementData } from '../hooks/usePlacementData';

export default function CareerRecommendations() {
  const analysis = useResumeAnalysis();
  const { latestInterview, profile } = usePlacementData();
  const skills = analysis ? getPlannedSkills(analysis, profile.skills) : [];
  const gaps = skills.filter((skill) => skill.gap > 0);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Missing Role Keywords</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {analysis
                  ? `Based on ${analysis.fileName} · ${analysis.roleName}`
                  : 'Analyze a resume to create a role-based plan'}
              </p>
            </div>
            {analysis && <Badge variant="warning">{gaps.length} to focus</Badge>}
          </div>
          {analysis ? (
            <ul className="space-y-3">
              {gaps.length === 0 ? (
                <p className="text-xs text-positive">
                  Gemini did not identify any significant role-related skill gaps in this resume.
                </p>
              ) : (
                gaps.slice(0, 4).map((skill) => (
                  <li key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between gap-3 text-xs">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-muted-foreground">
                        {skill.current ? 'Evidenced' : 'Gap to address'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-warning"
                        style={{
                          width: `${Math.min(100, (skill.current / skill.required) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <EmptyPlan />
          )}
        </section>

        <section
          id="interviews"
          className="bg-card border border-border rounded-2xl p-5 space-y-4 scroll-mt-6"
        >
          <div>
            <h2 className="text-sm font-semibold text-foreground">Interview Practice</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {analysis
                ? `Questions tailored to your ${analysis.roleName} focus areas`
                : 'Your practice questions will use the latest resume analysis'}
            </p>
          </div>
          {latestInterview ? (
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Latest completed interview</p>
              <p className="text-3xl font-bold mt-1">{latestInterview.score}<span className="text-sm text-muted-foreground">/100</span></p>
              <p className="text-xs text-muted-foreground mt-1">AI feedback is saved for each answer.</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Start a written interview tailored to your latest resume analysis. Gemini will score communication, technical reasoning, and confidence for each answer.</p>
          )}
          <Link href="/mock-interview" className="inline-block text-xs font-semibold text-accent hover:text-accent/80">{latestInterview ? 'Practice another interview →' : 'Start AI mock interview →'}</Link>
        </section>
      </div>
      {analysis && (
        <p className="text-[11px] text-muted-foreground px-1">
          Skill gaps come from the Gemini analysis of this resume and target role. Interview
          practice questions use those gaps to guide focused preparation.
        </p>
      )}
    </div>
  );
}

function EmptyPlan() {
  return (
    <div className="rounded-xl border border-dashed border-border p-4 text-center space-y-2">
      <Icon
        name="DocumentMagnifyingGlassIcon"
        size={20}
        className="text-muted-foreground mx-auto"
      />
      <p className="text-xs text-muted-foreground">
        No resume analysis yet. Upload a PDF to personalize these recommendations.
      </p>
      <Link
        href="/resume-analyzer"
        className="inline-block text-xs font-semibold text-accent hover:text-accent/80"
      >
        Analyze a resume →
      </Link>
    </div>
  );
}

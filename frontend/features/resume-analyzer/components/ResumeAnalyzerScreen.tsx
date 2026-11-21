'use client';

import React, { useState } from 'react';
import ResumeUploadPanel from './ResumeUploadPanel';
import ATSScorePanel from './ATSScorePanel';
import AnalysisResults from './AnalysisResults';
import Icon from '@/frontend/components/ui/AppIcon';
import Badge from '@/frontend/components/ui/Badge';
import { notifyResumeAnalysisSaved } from '@/frontend/features/placement-dashboard/hooks/useResumeAnalysis';
import type { ResumeAnalysisResult } from '@/shared/types/analysisTypes';

export type AnalysisState = 'idle' | 'analyzing' | 'results' | 'error';

const jobRoles = [
  { id: 'role-sde', label: 'Software Development Engineer (SDE)' },
  { id: 'role-ml', label: 'Machine Learning Engineer' },
  { id: 'role-data', label: 'Data Analyst' },
  { id: 'role-devops', label: 'DevOps / Cloud Engineer' },
  { id: 'role-product', label: 'Product Manager' },
  { id: 'role-frontend', label: 'Frontend Developer' },
  { id: 'role-backend', label: 'Backend Developer' },
];

export default function ResumeAnalyzerScreen() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [selectedRole, setSelectedRole] = useState('role-sde');
  const [fileName, setFileName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [saveWarning, setSaveWarning] = useState('');

  const runAnalysis = async (file: File, roleId: string) => {
    setFileName(file.name);
    setAnalysisState('analyzing');
    setErrorMessage('');
    setSaveWarning('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('roleId', roleId);
      formData.append(
        'roleName',
        jobRoles.find((role) => role.id === roleId)?.label ?? 'Selected role'
      );
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(95000),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        persisted?: boolean;
        notice?: string;
      } & ResumeAnalysisResult;
      if (!response.ok)
        throw new Error(payload.error ?? 'Resume analysis failed. Please try again.');
      const result = payload;
      setAnalysisResult(result);
      if (payload.persisted === false)
        setSaveWarning(payload.notice ?? 'Analysis could not be saved to your account.');
      else notifyResumeAnalysisSaved();
      setAnalysisState('results');
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
      setErrorMessage(
        timedOut
          ? 'Analysis took too long. Your PDF is still selected; retry in a moment.'
          : error instanceof Error
            ? error.message
            : 'Resume analysis failed. Please try again.'
      );
      setAnalysisState('error');
    }
  };

  const handleFileSelected = (file: File) => {
    setUploadError('');
    setResumeFile(file);
    void runAnalysis(file, selectedRole);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    if (analysisState === 'results' && resumeFile) void runAnalysis(resumeFile, roleId);
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setFileName('');
    setResumeFile(null);
    setAnalysisResult(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resume Analyzer</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Get an AI-powered role fit estimate, resume-specific skill gaps, and practical
              improvement suggestions
            </p>
          </div>
          {analysisState === 'results' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary/80 transition-all duration-150 active:scale-95"
            >
              <Icon name="ArrowPathIcon" size={16} className="text-muted-foreground" />
              Analyze Another Resume
            </button>
          )}
        </div>

        {/* Job Role Selector */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Icon name="BriefcaseIcon" size={16} className="text-primary" />
              <label className="text-sm font-semibold text-foreground">Target Role:</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {jobRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  disabled={analysisState === 'analyzing'}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150
                    ${
                      selectedRole === role.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border'
                    }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {analysisState === 'idle' && (
          <ResumeUploadPanel
            onFileSelected={handleFileSelected}
            onFileError={setUploadError}
            errorMessage={uploadError}
          />
        )}

        {analysisState === 'analyzing' && (
          <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center gap-6 min-h-64">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
                <Icon name="DocumentTextIcon" size={28} className="text-primary" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-base font-semibold text-foreground">Analyzing {fileName}...</p>
              <p className="text-sm text-muted-foreground">
                Extracting resume text and asking Gemini to assess it for the selected role
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['PDF text extraction', 'Gemini role analysis', 'Personalized skill gaps'].map(
                (step, i) => (
                  <Badge key={step} variant="info">
                    <Icon
                      name="ArrowPathIcon"
                      size={10}
                      className="animate-spin"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                    {step}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}

        {analysisState === 'results' && (
          <>
            {saveWarning && (
              <p
                role="status"
                className="rounded-lg border border-warning/30 bg-[var(--warning-bg)] px-4 py-3 text-sm text-foreground"
              >
                {saveWarning}
              </p>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
              {/* Left: ATS Score */}
              <div className="lg:col-span-1 space-y-4">
                {analysisResult && <ATSScorePanel result={analysisResult} />}
              </div>
              {/* Right: Analysis Details */}
              <div className="lg:col-span-2">
                {analysisResult && <AnalysisResults result={analysisResult} />}
              </div>
            </div>
          </>
        )}

        {analysisState === 'error' && (
          <div className="bg-card border border-negative/30 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 min-h-48">
            <div className="w-14 h-14 rounded-full bg-[var(--negative-bg)] flex items-center justify-center">
              <Icon name="ExclamationTriangleIcon" size={24} className="text-negative" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-foreground">Analysis failed</p>
              <p className="text-sm text-muted-foreground">
                {errorMessage ||
                  'Could not process your resume. Ensure it is a readable PDF under 5MB.'}
              </p>
            </div>
            <button
              onClick={() => {
                if (resumeFile) void runAnalysis(resumeFile, selectedRole);
                else handleReset();
              }}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
            >
              {resumeFile ? 'Retry Analysis' : 'Try Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

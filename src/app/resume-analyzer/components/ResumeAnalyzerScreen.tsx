'use client';

import React, { useState } from 'react';
import ResumeUploadPanel from './ResumeUploadPanel';
import ATSScorePanel from './ATSScorePanel';
import AnalysisResults from './AnalysisResults';
import Icon from '@/components/ui/AppIcon';
import Badge from '@/components/ui/Badge';

export type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'results' | 'error';

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleFileSelected = async (file: File) => {
    setFileName(file.name);
    setAnalysisState('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    // BACKEND INTEGRATION: POST /api/resume/upload — multipart/form-data
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 80));
      setUploadProgress(i);
    }

    setAnalysisState('analyzing');
    // BACKEND INTEGRATION: POST /api/resume/analyze — { resumeId, targetRole: selectedRole }
    await new Promise((r) => setTimeout(r, 2200));
    setAnalysisState('results');
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setFileName('');
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resume Analyzer</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Get your ATS score, keyword gaps, and AI-powered improvement suggestions
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
                  onClick={() => setSelectedRole(role.id)}
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
        {analysisState === 'idle' && <ResumeUploadPanel onFileSelected={handleFileSelected} />}

        {(analysisState === 'uploading' || analysisState === 'analyzing') && (
          <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center gap-6 min-h-64">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
                <Icon name="DocumentTextIcon" size={28} className="text-primary" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-base font-semibold text-foreground">
                {analysisState === 'uploading'
                  ? `Uploading ${fileName}...`
                  : 'Analyzing your resume...'}
              </p>
              <p className="text-sm text-muted-foreground">
                {analysisState === 'uploading'
                  ? 'Securely uploading your PDF'
                  : 'Running ATS compatibility check, keyword extraction, and AI scoring'}
              </p>
            </div>

            {analysisState === 'uploading' && (
              <div className="w-64 space-y-1.5">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground tabular-nums">
                  {uploadProgress}%
                </p>
              </div>
            )}

            {analysisState === 'analyzing' && (
              <div className="flex flex-wrap justify-center gap-2">
                {['ATS Parsing', 'Keyword Match', 'Section Scoring', 'AI Suggestions'].map(
                  (step, i) => (
                    <Badge key={`analyze-step-${step}`} variant="info">
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
            )}
          </div>
        )}

        {analysisState === 'results' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
            {/* Left: ATS Score */}
            <div className="lg:col-span-1 space-y-4">
              <ATSScorePanel fileName={fileName} selectedRole={selectedRole} jobRoles={jobRoles} />
            </div>
            {/* Right: Analysis Details */}
            <div className="lg:col-span-2">
              <AnalysisResults />
            </div>
          </div>
        )}

        {analysisState === 'error' && (
          <div className="bg-card border border-negative/30 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 min-h-48">
            <div className="w-14 h-14 rounded-full bg-[var(--negative-bg)] flex items-center justify-center">
              <Icon name="ExclamationTriangleIcon" size={24} className="text-negative" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-foreground">Analysis failed</p>
              <p className="text-sm text-muted-foreground">
                Could not process your resume. Ensure the PDF is not password-protected and is under
                5MB.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

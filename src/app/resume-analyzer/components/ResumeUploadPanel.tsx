'use client';

import React, { useCallback, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ResumeUploadPanelProps {
  onFileSelected: (file: File) => void;
}

export default function ResumeUploadPanel({ onFileSelected }: ResumeUploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState('');

  const validateAndProcess = useCallback(
    (file: File) => {
      setDragError('');
      if (file.type !== 'application/pdf') {
        setDragError('Only PDF files are supported. Please upload a .pdf resume.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setDragError('File too large. Maximum size is 5MB.');
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndProcess(file);
    },
    [validateAndProcess]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndProcess(file);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-5 transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : dragError
                ? 'border-negative bg-[var(--negative-bg)]'
                : 'border-border hover:border-primary/40 hover:bg-secondary/30'
          }
        `}
        onClick={() => document.getElementById('resume-file-input')?.click()}
      >
        <input
          id="resume-file-input"
          type="file"
          accept=".pdf"
          className="sr-only"
          onChange={handleFileInput}
        />

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
          ${isDragging ? 'bg-primary/20' : 'bg-secondary'}`}
        >
          <Icon
            name="DocumentArrowUpIcon"
            size={32}
            className={
              isDragging ? 'text-primary' : dragError ? 'text-negative' : 'text-muted-foreground'
            }
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">
            {isDragging ? 'Drop your resume here' : 'Upload your resume'}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag & drop your PDF, or{' '}
            <span className="text-primary font-medium">click to browse</span>
          </p>
          <p className="text-xs text-muted-foreground">PDF only · Maximum 5MB</p>
        </div>

        {dragError && (
          <div className="flex items-center gap-2 bg-[var(--negative-bg)] border border-negative/20 rounded-lg px-4 py-2.5">
            <Icon name="ExclamationCircleIcon" size={16} className="text-negative flex-shrink-0" />
            <p className="text-sm text-negative font-medium">{dragError}</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            id: 'tip-format',
            icon: 'DocumentTextIcon',
            title: 'Use PDF format',
            desc: 'ATS systems parse PDFs more reliably than .doc or .docx files',
          },
          {
            id: 'tip-ats',
            icon: 'MagnifyingGlassIcon',
            title: 'ATS-friendly layout',
            desc: 'Avoid tables, columns, and images — they confuse most ATS parsers',
          },
          {
            id: 'tip-keywords',
            icon: 'TagIcon',
            title: 'Include keywords',
            desc: 'Use exact terms from the job description in your skills and experience',
          },
        ].map((tip) => (
          <div
            key={tip.id}
            className="bg-card border border-border rounded-xl p-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon
                name={tip.icon as Parameters<typeof Icon>[0]['name']}
                size={16}
                className="text-primary"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{tip.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

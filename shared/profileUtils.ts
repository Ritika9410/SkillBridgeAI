import type { StudentProfile } from './types/analysisTypes';

export const emptyStudentProfile = (fullName = ''): StudentProfile => ({
  fullName, college: '', branch: '', year: '', cgpa: '', skills: [], projects: [],
  certifications: [], github: '', linkedin: '',
});

export function getProfileCompletion(profile: StudentProfile): number {
  const checks = [
    !!profile.fullName.trim(), !!profile.college.trim(), !!profile.branch.trim(),
    !!profile.year.trim(), !!profile.cgpa.trim(), profile.skills.length > 0,
    profile.projects.length > 0, profile.certifications.length > 0,
    !!profile.github.trim(), !!profile.linkedin.trim(),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

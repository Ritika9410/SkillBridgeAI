'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AppLogo from '@/frontend/components/ui/AppLogo';
import Icon from '@/frontend/components/ui/AppIcon';
import ThemeToggle from '@/frontend/components/ThemeToggle';

type AuthTab = 'login' | 'signup';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const projectHighlights = [
  { value: 'PDF', label: 'Resume analysis' },
  { value: 'Role-based', label: 'Skill gap insights' },
  { value: '4-week', label: 'Learning roadmap' },
];

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', remember: false },
  });

  const signupForm = useForm<SignupFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Could not sign in. Please try again.');
      toast.success('Signed in successfully.');
      router.replace('/placement-dashboard');
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Could not sign in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Could not create your account.');
      toast.success('Account created. Welcome to SkillBridgeAI!');
      router.replace('/placement-dashboard');
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Could not create your account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page-compact min-h-[100svh] bg-background flex">
      {/* Left Panel */}
      <div className="auth-showcase hidden lg:flex flex-col justify-between w-[480px] xl:w-[520px] flex-shrink-0 bg-card border-r border-border p-10 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 blob-primary pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 blob-accent pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <AppLogo size={40} />
          <span className="font-bold text-xl tracking-tight text-foreground">
            SkillBridge<span className="text-primary">AI</span>
          </span>
        </div>

        {/* Center Content */}
        <div className="auth-showcase-content relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full score-pulse" />
              <span className="text-primary text-xs font-semibold tracking-wide">
                AI-Powered Career Intelligence
              </span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tight text-foreground">
              From Campus to <span className="text-primary">Career-Ready</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Refine your resume with practical feedback, understand the skills to build for your
              target role, and grow more confident through guided learning and interview practice.
            </p>
          </div>

          {/* Feature Highlights */}
          <ul className="auth-feature-list space-y-3">
            {[
              {
                icon: 'DocumentMagnifyingGlassIcon',
                text: 'AI-assisted resume scoring and suggestions',
              },
              { icon: 'PuzzlePieceIcon', text: 'Skill gap analysis for your target role' },
              { icon: 'MapIcon', text: 'Personalized weekly learning roadmap' },
              {
                icon: 'ChatBubbleLeftRightIcon',
                text: 'Text-based mock interviews with AI feedback',
              },
            ].map((feat) => (
              <li key={`feat-${feat.icon}`} className="flex items-center gap-3">
                <div className="auth-feature-icon w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon
                    name={feat.icon as Parameters<typeof Icon>[0]['name']}
                    size={16}
                    className="text-primary"
                  />
                </div>
                <span className="text-sm text-foreground/80">{feat.text}</span>
              </li>
            ))}
          </ul>

          {/* Project capabilities */}
          <div className="auth-capabilities grid grid-cols-3 gap-4">
            {projectHighlights.map((stat) => (
              <div
                key={`stat-${stat.label}`}
                className="text-center p-3 bg-secondary/50 rounded-xl border border-border"
              >
                <p className="text-xl font-bold text-primary tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Project context */}
        <div className="relative z-10">
          <p className="auth-project-note mb-6 border-l-2 border-primary/40 pl-4 text-base leading-relaxed text-muted-foreground">
            Your career preparation, organized in one place.
          </p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="auth-form-side relative flex-1 flex items-center justify-center p-6 lg:p-12">
        <ThemeToggle className="absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground" />
        <div className="auth-form-stack w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <AppLogo size={36} />
            <span className="font-bold text-lg text-foreground">
              SkillBridge<span className="text-primary">AI</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="bg-secondary rounded-xl p-1 flex">
            <button
              onClick={() => {
                setSubmitError('');
                setActiveTab('login');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-card text-foreground shadow-card'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setSubmitError('');
                setActiveTab('signup');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-card text-foreground shadow-card'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Card */}
          <div className="auth-form-card bg-card border border-border rounded-2xl p-7 shadow-card space-y-5">
            {submitError && (
              <p
                role="alert"
                className="rounded-lg border border-negative/30 bg-negative/10 p-3 text-sm text-negative"
              >
                {submitError}
              </p>
            )}
            {activeTab === 'login' ? (
              <form
                onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                className="auth-form space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground block">Email Address</label>
                  <input
                    type="email"
                    placeholder="arjun@college.edu.in"
                    {...loginForm.register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                    })}
                    className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-negative text-xs mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...loginForm.register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'At least 6 characters' },
                      })}
                      className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-negative text-xs mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    {...loginForm.register('remember')}
                    className="w-4 h-4 rounded border-border bg-input accent-primary"
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm transition-all duration-150 hover:bg-primary/90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>
              </form>
            ) : (
              <form
                onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
                className="auth-form space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground block">Full Name</label>
                  <input
                    type="text"
                    placeholder="Arjun Kumar"
                    {...signupForm.register('fullName', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Enter your full name' },
                    })}
                    className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  {signupForm.formState.errors.fullName && (
                    <p className="text-negative text-xs mt-1">
                      {signupForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground block">Email Address</label>
                  <input
                    type="email"
                    placeholder="arjun@college.edu.in"
                    {...signupForm.register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                    })}
                    className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-negative text-xs mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
                  New accounts are created as student accounts. TPO access is assigned separately.
                </p>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      {...signupForm.register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'At least 8 characters required' },
                        pattern: {
                          value: /^(?=.*[A-Z])(?=.*\d)/,
                          message: 'Must include one uppercase letter and one number',
                        },
                      })}
                      className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-negative text-xs mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      {...signupForm.register('confirmPassword', {
                        required: 'Please confirm your password',
                      })}
                      className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-negative text-xs mt-1">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    {...signupForm.register('terms', {
                      required: 'You must accept the terms to continue',
                    })}
                    className="w-4 h-4 mt-0.5 rounded border-border bg-input accent-primary flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the{' '}
                    <span className="text-accent hover:underline cursor-pointer">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-accent hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </label>
                </div>
                {signupForm.formState.errors.terms && (
                  <p className="text-negative text-xs">
                    {signupForm.formState.errors.terms.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm transition-all duration-150 hover:bg-primary/90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    'Create My Account'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

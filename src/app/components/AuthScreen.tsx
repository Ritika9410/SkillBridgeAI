'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

type AuthTab = 'login' | 'signup';
type UserRole = 'student' | 'tpo';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface SignupFormData {
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const demoCredentials = [
  { role: 'Student', email: 'arjun.kumar@nitk.edu.in', password: 'Arjun@2026' },
  { role: 'TPO Officer', email: 'placement.cell@nitk.edu.in', password: 'TPO@Nitk2026' },
];

const stats = [
  { value: '94%', label: 'Placement Rate Improvement' },
  { value: '12K+', label: 'Students Placed' },
  { value: '4.8★', label: 'Average Rating' },
];

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', remember: false },
  });

  const signupForm = useForm<SignupFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      role: 'student',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    // BACKEND INTEGRATION: POST /api/auth/login with { email, password }
    await new Promise((r) => setTimeout(r, 1200));
    const validDemo = demoCredentials.find(
      (c) => c.email === data.email && c.password === data.password
    );
    if (!validDemo) {
      loginForm.setError('email', {
        message: 'Invalid credentials — use the demo accounts below to sign in',
      });
      setIsSubmitting(false);
      return;
    }
    toast.success(`Welcome back! Redirecting to your dashboard...`);
    await new Promise((r) => setTimeout(r, 800));
    router.push('/placement-dashboard');
    setIsSubmitting(false);
  };

  const handleSignupSubmit = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setIsSubmitting(true);
    // BACKEND INTEGRATION: POST /api/auth/register with user data
    await new Promise((r) => setTimeout(r, 1400));
    toast.success('Account created! Setting up your profile...');
    await new Promise((r) => setTimeout(r, 600));
    router.push('/placement-dashboard');
    setIsSubmitting(false);
  };

  const autofillCredentials = (cred: (typeof demoCredentials)[0]) => {
    loginForm.setValue('email', cred.email);
    loginForm.setValue('password', cred.password);
    toast.info(`Demo credentials filled for ${cred.role}`);
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] xl:w-[520px] flex-shrink-0 bg-card border-r border-border p-10 relative overflow-hidden">
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
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full score-pulse" />
              <span className="text-primary text-xs font-semibold tracking-wide">
                AI-Powered Career Intelligence
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground">
              From Campus to <span className="text-gradient-primary">Career-Ready</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Analyze your resume, identify skill gaps, build a personalized learning roadmap, and
              ace mock interviews — all in one platform.
            </p>
          </div>

          {/* Feature Highlights */}
          <ul className="space-y-3">
            {[
              {
                icon: 'DocumentMagnifyingGlassIcon',
                text: 'ATS Resume Analysis with instant scoring',
              },
              { icon: 'PuzzlePieceIcon', text: 'Skill gap detection vs your target role' },
              { icon: 'MapIcon', text: 'Personalized weekly learning roadmap' },
              {
                icon: 'ChatBubbleLeftRightIcon',
                text: 'AI mock interviews with real-time feedback',
              },
            ].map((feat) => (
              <li key={`feat-${feat.icon}`} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
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

        {/* Bottom Quote */}
        <div className="relative z-10">
          <blockquote className="border-l-2 border-primary/40 pl-4">
            <p className="text-sm text-muted-foreground italic">
              &quot;SkillBridge AI helped me go from a 52% ATS score to 89% in two weeks. Got 4
              interview calls from top MNCs.&quot;
            </p>
            <footer className="mt-2 text-xs text-muted-foreground font-medium">
              — Priya Sharma, SDE @ Google · IIT Bombay 2025
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
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
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-card text-foreground shadow-card'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
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
          <div className="bg-card border border-border rounded-2xl p-7 shadow-card space-y-5">
            {activeTab === 'login' ? (
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
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
                    <button
                      type="button"
                      className="text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                      Forgot password?
                    </button>
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
              <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
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

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground block">I am a</label>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Select your role to personalize your experience
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['student', 'tpo'] as UserRole[]).map((role) => (
                      <label
                        key={`role-${role}`}
                        className={`
                          flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-150
                          ${
                            signupForm.watch('role') === role
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          value={role}
                          {...signupForm.register('role')}
                          className="sr-only"
                        />
                        <Icon
                          name={role === 'student' ? 'AcademicCapIcon' : 'BuildingOfficeIcon'}
                          size={18}
                          className="flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-semibold">
                            {role === 'student' ? 'Student' : 'TPO Officer'}
                          </p>
                          <p className="text-[10px] opacity-70">
                            {role === 'student' ? 'College / University' : 'Placement Cell'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

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

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Google', icon: 'GlobeAltIcon' },
                { name: 'GitHub', icon: 'CodeBracketIcon' },
              ].map((provider) => (
                <button
                  key={`provider-${provider.name}`}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary/80 hover:border-border/80 transition-all duration-150 active:scale-95"
                >
                  <Icon
                    name={provider.icon as Parameters<typeof Icon>[0]['name']}
                    size={16}
                    className="text-muted-foreground"
                  />
                  {provider.name}
                </button>
              ))}
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-card border border-accent/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="InformationCircleIcon" size={16} className="text-accent" />
              <p className="text-xs font-semibold text-accent">Demo Credentials</p>
            </div>
            <div className="space-y-2">
              {demoCredentials.map((cred) => (
                <div
                  key={`demo-${cred.role}`}
                  className="flex items-center justify-between gap-3 p-2.5 bg-secondary/50 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">{cred.role}</p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      {cred.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      autofillCredentials(cred);
                    }}
                    className="flex-shrink-0 px-2.5 py-1 bg-accent/10 text-accent text-[11px] font-semibold rounded-md hover:bg-accent/20 transition-colors"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

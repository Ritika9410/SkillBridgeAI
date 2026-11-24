'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/frontend/components/ui/AppLogo';
import Icon from '@/frontend/components/ui/AppIcon';
import ThemeToggle from '@/frontend/components/ThemeToggle';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    href: '/placement-dashboard',
    icon: 'SquaresPlusIcon',
    group: 'main',
  },
  {
    id: 'nav-resume',
    label: 'Resume Analyzer',
    href: '/resume-analyzer',
    icon: 'DocumentTextIcon',
    group: 'main',
  },
  {
    id: 'nav-skills',
    label: 'Skill Gap Analysis',
    href: '/placement-dashboard#skill-gap',
    icon: 'PuzzlePieceIcon',
    group: 'main',
  },
  {
    id: 'nav-roadmap',
    label: 'Learning Roadmap',
    href: '/placement-dashboard#roadmap',
    icon: 'MapIcon',
    group: 'main',
  },
  {
    id: 'nav-interview',
    label: 'Mock Interviews',
    href: '/mock-interview',
    icon: 'ChatBubbleLeftRightIcon',
    group: 'main',
  },
  {
    id: 'nav-profile',
    label: 'My Profile',
    href: '/profile',
    icon: 'UserCircleIcon',
    group: 'account',
  },
];

interface SidebarProps {
  activePath?: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me')
      .then(async (response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (mounted && payload?.user) setCurrentUser(payload.user);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    router.replace('/login');
    router.refresh();
  };

  const mainItems = navItems.filter((n) => n.group === 'main');
  const accountItems = navItems.filter((n) => n.group === 'account');

  const isActive = (href: string) => {
    const [path, hash] = href.split('#');
    return activePath === path && (hash ? currentHash === `#${hash}` : !currentHash);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? 'justify-center px-2' : ''}`}
      >
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-base tracking-tight text-foreground">
            SkillBridge<span className="text-primary">AI</span>
          </span>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {/* Main */}
        <div>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
              Platform
            </p>
          )}
          <ul className="space-y-1">
            {mainItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    relative flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-medium
                    transition-all duration-150 group
                    ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon
                    name={item.icon as Parameters<typeof Icon>[0]['name']}
                    size={18}
                    variant={isActive(item.href) ? 'solid' : 'outline'}
                    className="flex-shrink-0"
                  />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="bg-accent/20 text-accent text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
              Account
            </p>
          )}
          <ul className="space-y-1">
            {accountItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-medium
                    transition-all duration-150
                    ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon
                    name={item.icon as Parameters<typeof Icon>[0]['name']}
                    size={18}
                    variant="outline"
                    className="flex-shrink-0"
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-border p-3 space-y-2">
        <ThemeToggle
          showLabel={!collapsed}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 text-xs font-medium"
        />
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-secondary/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-bold">
                {(currentUser?.name ?? 'User')
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {currentUser?.name ?? 'Signed in'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email ?? ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          title={collapsed ? 'Sign out' : undefined}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 text-xs font-medium"
        >
          <Icon name="ArrowRightOnRectangleIcon" size={16} />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 text-xs font-medium"
        >
          <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={16} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col bg-card border-r border-border
          sidebar-transition flex-shrink-0 h-screen sticky top-0
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon name="Bars3Icon" size={20} />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-card border-r border-border h-full flex flex-col z-10 slide-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Icon name="XMarkIcon" size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

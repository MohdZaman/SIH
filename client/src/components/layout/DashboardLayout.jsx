import React, { useState } from 'react';
import { Menu, Bell, Shield, ExternalLink, HelpCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Footer from './Footer';
import GovAIChatDrawer from '../chat/GovAIChatDrawer';

export default function DashboardLayout({
  children,
  headerTitle,
  headerSubtitle,
  actions,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('manakai_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('manakai_sidebar_collapsed', String(next));
      } catch { }
      return next;
    });
  };

  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-brand-light flex antialiased">
      {/* Collapsible & Interactive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Area (Fluid flex sibling: naturally adjusts width, never hidden or overlapped) */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out">
        {/* Top Workspace Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left Header Controls */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>


              <div className="min-w-0">
                {headerTitle && (
                  <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-normal truncate">
                    {headerTitle}
                  </h1>
                )}
                {headerSubtitle && (
                  <p className="text-xs font-normal text-slate-500 truncate hidden sm:block">
                    {headerSubtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right Header Badges & Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {actions}

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              {/* Verified NIC badge */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
                <Shield className="h-3.5 w-3.5" />
                <span>GeM Live Connected</span>
              </div>

              {/* Notification icon */}
              <button
                type="button"
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-blue" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Canvas Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer variant="light" />
      </div>

      {/* Floating Copilot Chat Assistant */}
      <GovAIChatDrawer />
    </div>
  );
}
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Search,
  Network,
  ShieldAlert,
  FileText,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = () => dispatch(logoutUser());

  const PRIMARY_NAV = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: Home,
    },
    {
      to: '/tender-auditor',
      label: 'Audit Tender',
      icon: Users,
      badge: 'New',
    },
    {
      to: '/spec-recommender',
      label: 'Search Standards',
      icon: Search,
    },
    {
      to: '/normative-graph',
      label: 'Normative Graph',
      icon: Network,
    },
    {
      to: '/qco-tracker',
      label: 'QCO Tracker',
      icon: ShieldAlert,
    },
  ];

  const SECONDARY_NAV = [
    {
      to: '/clause-studio',
      label: 'Reports & Clauses',
      icon: FileText,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay (only on mobile when open) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar: Drawer on mobile, Sticky Flex sibling on desktop (no overlaying page content) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 lg:static lg:top-0 lg:h-screen lg:z-20 shrink-0 bg-[#FBFBFC] border-r border-slate-200/80 flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl w-60' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[70px]' : 'lg:w-60'}`}
      >
        {/* Header: ONLY ManakAI in green, NO black box */}
        <div className={`border-b border-slate-100 flex items-center transition-all duration-300 ${
          isCollapsed ? 'p-3 flex-col justify-center gap-2' : 'px-4 py-4 justify-between'
        }`}>
          {!isCollapsed ? (
            <span className="font-semibold text-lg text-emerald-600 tracking-tight select-none">
              ManakAI
            </span>
          ) : (
            <span
              className="font-bold text-base text-emerald-600 tracking-tight select-none"
              title="ManakAI"
            >
              M
            </span>
          )}

          <div className="flex items-center gap-1">
            {/* Collapse/Expand Toggle on Desktop */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4 text-slate-500" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Close Button on Mobile */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Items (No Quick actions) */}
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {/* Primary Nav */}
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isCollapsed ? 'justify-center px-0' : ''
                } ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-normal'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Section Divider */}
          <div className="py-2">
            <div className="border-t border-slate-200/70" />
          </div>

          {/* Secondary Nav */}
          {SECONDARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isCollapsed ? 'justify-center px-0' : ''
                } ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-normal'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Officer Card & Sign Out */}
        <div className={`p-2.5 border-t border-slate-200/80 bg-[#F8FAFC] ${
          isCollapsed ? 'flex flex-col items-center gap-2' : ''
        }`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-7 w-7 rounded-full bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-medium flex items-center justify-center shrink-0 uppercase">
                  {user?.name ? user.name.slice(0, 2) : 'AD'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate leading-tight">
                    {user?.name || 'Officer Session'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-normal truncate leading-tight mt-0.5">
                    {user?.department || 'Procurement Officer'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
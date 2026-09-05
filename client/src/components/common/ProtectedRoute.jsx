import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../features/auth/authSlice';
import { getTokenCookie, getUserCookie } from '../../utils/cookieUtils';

/**
 * Route guard that strictly restricts access to registered and logged-in users.
 * Unauthenticated users are redirected to /login with state preservation.
 */
export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Validate state and persistence cookies
  const hasToken = Boolean(token || getTokenCookie());
  const hasUser = Boolean(user || getUserCookie());
  const isAuthorized = isAuthenticated || (hasToken && hasUser);

  useEffect(() => {
    const activeToken = token || getTokenCookie();
    if (activeToken) {
      dispatch(fetchProfile()).catch(() => {});
    }
  }, [dispatch, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E131F] flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-xs font-medium text-slate-400">Verifying authorized officer session...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

/**
 * Route guard for guest-only pages (e.g. /login, /register).
 * If the user is already logged in, redirect them directly to the workspace.
 */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const hasToken = Boolean(token || getTokenCookie());
  const hasUser = Boolean(user || getUserCookie());
  const isAuthorized = isAuthenticated || (hasToken && hasUser);

  if (isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}

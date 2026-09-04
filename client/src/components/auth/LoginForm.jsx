import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { loginOfficer, clearAuthError } from '../../features/auth/authSlice';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState(() => location.state?.email || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState('');

  const registeredNotice = location.state?.registered
    ? 'Account created successfully! Please sign in with your credentials.'
    : null;

  const redirectNotice = location.state?.from && !location.state?.registered
    ? 'Access restricted: Please sign in with your registered credentials to access the workspace.'
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearAuthError());

    try {
      const res = await dispatch(loginOfficer({ email, password })).unwrap();
      toast.success(`Welcome back, ${res?.user?.name || 'Officer'}!`);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : err?.message || 'Login failed. Check your credentials.';
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight">
          Sign in
        </h1>
        <p className="mt-2 text-xs text-neutral-500 font-normal leading-relaxed">
          Welcome to the Smart Standards Grid.
          <br />
          Sign in to your account to experience.
        </p>
      </div>

      {/* Registration success notice */}
      {registeredNotice && !localError && !error && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span>{registeredNotice}</span>
        </div>
      )}

      {/* Redirect warning if arriving from protected route */}
      {redirectNotice && !localError && !error && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          {redirectNotice}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* E-mail */}
        <div>
          <label className="block text-xs text-neutral-700 font-medium mb-1.5">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yatingzang0215@gmail.com"
            className="w-full px-4 py-3 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-lg border border-neutral-300 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-neutral-700 font-medium">
              Password
            </label>
            <button
              type="button"
              onClick={() => toast.info('Password reset instructions will be emailed to your account.')}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
            >
              Forgot?
            </button>
          </div>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-4 py-3 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-lg border border-neutral-300 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition-all font-mono"
          />
        </div>

        {/* Remember Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
          />
          <label htmlFor="remember" className="text-xs text-neutral-600 font-normal select-none cursor-pointer">
            Remember this session
          </label>
        </div>

        {/* Sign In Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 disabled:opacity-60 flex items-center justify-center cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        {/* Footer Link */}
        <div className="pt-4 text-xs text-neutral-500 font-normal text-center sm:text-left">
          Not a member yet?{' '}
          <Link
            to="/register"
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors ml-1"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { registerAgency, clearAuthError } from '../../features/auth/authSlice';

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearAuthError());

    const trimmedName = formData.name.trim();
    if (trimmedName.length < 2) {
      const msg = 'Name must be at least 2 characters long.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    if (formData.password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    if (!agreeTerms) {
      const msg = 'Please agree to the terms of service to proceed.';
      setLocalError(msg);
      toast.error(msg);
      return;
    }

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      await dispatch(
        registerAgency({
          name: trimmedName,
          email: normalizedEmail,
          password: formData.password,
        })
      ).unwrap();

      toast.success('Account created successfully! Please sign in with your credentials.');
      navigate('/login', {
        state: {
          email: normalizedEmail,
          registered: true,
        },
        replace: true,
      });
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : err?.message || 'Registration failed';
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight">
          Sign up
        </h1>
        <p className="mt-2 text-xs text-neutral-500 font-normal leading-relaxed">
          Welcome to the Smart Standards Grid.
          <br />
          Register as a member to experience.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs text-neutral-700 font-medium mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            minLength={2}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Officer Name"
            className="w-full px-4 py-3 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-lg border border-neutral-300 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition-all"
          />
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-xs text-neutral-700 font-medium mb-1.5">
            E-mail
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="yatingzang0215@gmail.com"
            className="w-full px-4 py-3 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-lg border border-neutral-300 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs text-neutral-700 font-medium mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••••••"
            className="w-full px-4 py-3 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-lg border border-neutral-300 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition-all font-mono"
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-neutral-600 font-normal select-none cursor-pointer">
            I agree to the terms of service
          </label>
        </div>

        {/* Create Account Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 disabled:opacity-60 flex items-center justify-center cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Footer Link */}
        <div className="pt-4 text-xs text-neutral-500 font-normal text-center sm:text-left">
          Already a member?{' '}
          <Link
            to="/login"
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors ml-1"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
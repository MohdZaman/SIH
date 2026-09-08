import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerAgency, clearAuthError } from '../../features/auth/authSlice';
import { notify } from '@/lib/notify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IdCard, Mail, Lock, User } from 'lucide-react';

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    employeeID: '',
    name: '',
    email: '',
    password: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const normalizedEmpId = formData.employeeID.trim().toUpperCase();
    if (!normalizedEmpId) {
      notify.error('Government Employee ID is required.', 'Please provide an authorized ID.');
      return;
    }

    const trimmedName = formData.name.trim();
    if (trimmedName.length < 2) {
      notify.error('Name must be at least 2 characters long.');
      return;
    }

    if (formData.password.length < 6) {
      notify.error('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      notify.error('Please agree to the terms of service to proceed.');
      return;
    }

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      await dispatch(
        registerAgency({
          employeeID: normalizedEmpId,
          name: trimmedName,
          email: normalizedEmail,
          password: formData.password,
        })
      ).unwrap();

      notify.success('Account created successfully!', 'Please sign in with your authorized credentials.');
      navigate('/login', {
        state: {
          email: normalizedEmail,
          registered: true,
        },
        replace: true,
      });
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : err?.message || 'Registration failed';
      notify.error(errMsg, 'Please check details or server availability.');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-neutral-950 tracking-tight">
          Sign up
        </h1>
        <p className="mt-2 text-xs text-neutral-500 font-normal leading-relaxed">
          Welcome to the Smart Standards Grid.
          <br />
          Register with your authorized government credentials.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Government Employee ID */}
        <div>
          <label className="block text-xs text-neutral-700 font-medium mb-1.5 flex items-center gap-1.5">
            <IdCard className="h-3.5 w-3.5 text-slate-500" />
            <span>Government Employee ID</span>
          </label>
          <Input
            type="text"
            required
            value={formData.employeeID}
            onChange={(e) => setFormData({ ...formData, employeeID: e.target.value.toUpperCase() })}
            placeholder="Enter Employee ID"
            className="w-full px-4 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-xl border border-neutral-300 focus:bg-white text-sm outline-none font-mono uppercase"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs text-neutral-700 font-medium mb-1.5 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-500" />
            <span>Officer Name</span>
          </label>
          <Input
            type="text"
            required
            minLength={2}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Rajesh Kumar"
            className="w-full px-4 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-xl border border-neutral-300 focus:bg-white text-sm outline-none font-sans"
          />
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-xs text-neutral-700 font-medium mb-1.5 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-500" />
            <span>Official E-mail</span>
          </label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="officer@nic.in"
            className="w-full px-4 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-xl border border-neutral-300 focus:bg-white text-sm outline-none font-sans"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs text-neutral-700 font-medium mb-1.5 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span>Password (min 6 chars)</span>
          </label>
          <Input
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••••••"
            className="w-full px-4 py-2.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 rounded-xl border border-neutral-300 focus:bg-white text-sm outline-none font-sans"
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
            I agree to the procurement terms of service
          </label>
        </div>

        {/* Create Account Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="royal"
            size="lg"
            disabled={loading}
            className="w-full text-sm font-medium py-3 rounded-xl cursor-pointer"
          >
            {loading ? 'Creating Official Account...' : 'Create Account'}
          </Button>
        </div>

        {/* Footer Link */}
        <div className="pt-4 text-xs text-neutral-500 font-normal text-center sm:text-left">
          Already registered?{' '}
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
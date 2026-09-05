import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="landing-nav z-20">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-semibold text-[17px] text-emerald-500 tracking-tight">
            ManakAI
          </span>
        </Link>
      </div>

      <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex ml-10">
        <Link to="/spec-recommender" className="hover:text-white transition-colors">
          Specifications
        </Link>
        <Link to="/normative-graph" className="hover:text-white transition-colors">
          Normative Graph
        </Link>
        <Link to="/qco-tracker" className="hover:text-white transition-colors">
          QCO Tracker
        </Link>
        <Link to="/tender-auditor" className="hover:text-white transition-colors">
          Tender Auditor
        </Link>
        <Link to="/clause-studio" className="hover:text-white transition-colors">
          Clause Studio
        </Link>
      </nav>

      <div className="ml-auto flex items-center gap-4">
        <Link
          to="/login"
          className="hidden text-sm text-slate-300 hover:text-white font-medium sm:block transition-colors"
        >
          Sign in
        </Link>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="outline-button"
        >
          <span>Open workspace</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
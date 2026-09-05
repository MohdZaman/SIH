import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  ShieldCheck,
  BookOpen,
  FileCheck,
  Network,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const sampleQueries = [
    { label: 'Fe 500D TMT Rebar', standard: 'IS 1786' },
    { label: 'Structural Steel Plates', standard: 'IS 2062' },
    { label: 'PVC Insulated Cables', standard: 'IS 694' },
    { label: 'Plugs & Socket Outlets', standard: 'IS 1293' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/spec-recommender?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/spec-recommender');
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased">
      {/* 1. Header: Clean White, Neutral, Emerald */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="text-emerald-600 font-semibold text-lg tracking-tight hover:text-emerald-700 transition-colors">
              ManakAI
            </Link>
            <span className="hidden sm:inline-flex items-center text-[10px] font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
              National Compliance Grid
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-600">
            <a href="#capabilities" className="hover:text-black transition-colors">
              Capabilities
            </a>
            <Link to="/spec-recommender" className="hover:text-black transition-colors">
              Standards Intelligence
            </Link>
            <Link to="/qco-tracker" className="hover:text-black transition-colors">
              QCO Tracker
            </Link>
            <Link to="/tender-auditor" className="hover:text-black transition-colors">
              Tender Auditor
            </Link>
            <Link to="/normative-graph" className="hover:text-black transition-colors">
              Normative Graph
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium text-neutral-700 hover:text-black transition-colors px-2 py-1.5"
            >
              Sign in
            </Link>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <span>Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Breathable White Canvas */}
      <section className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Emerald Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Bureau of Indian Standards &amp; Mandatory QCO Intelligence</span>
        </div>

        {/* Hero Title (Pure Black, Crisp Inter) */}
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-neutral-950 leading-[1.15] max-w-4xl mx-auto">
          The intelligence layer for Indian standards and public procurement.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Resolve colloquial BoQ descriptions to codified BIS references, audit draft tenders against mandatory Quality Control Orders, and ensure statutory compliance under the BIS Act 2016.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>Explore Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            to="/tender-auditor"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 hover:border-neutral-400 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>Audit Tender Clauses</span>
            <ChevronRight className="h-4 w-4 text-neutral-500" />
          </Link>
        </div>

        {/* 3. Search Bar Demonstration (Clean White & Emerald) */}
        <div className="mt-12 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center bg-white border border-neutral-300 rounded-xl p-1.5 shadow-md shadow-neutral-200/50 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all"
          >
            <div className="pl-3 text-neutral-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by colloquial term, product, or standard (e.g., Fe 500D TMT, cables, transformer)..."
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Verify
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-neutral-500 font-normal">Common Lookups:</span>
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(`/spec-recommender?q=${encodeURIComponent(item.label)}`)}
                className="text-[11px] font-medium text-neutral-700 hover:text-emerald-700 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
              >
                {item.label} <span className="text-neutral-500 text-[10px]">({item.standard})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Metric Ribbon: Subtle Neutral with Emerald Highlights */}
      <section className="border-y border-neutral-200 bg-neutral-50/70 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-neutral-950 tracking-tight">28,000+</div>
              <p className="text-xs text-neutral-600 mt-1 font-normal">BIS Standards Mapped</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-emerald-600 tracking-tight">180+</div>
              <p className="text-xs text-neutral-600 mt-1 font-normal">Active Gazette QCOs</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-neutral-950 tracking-tight">100%</div>
              <p className="text-xs text-neutral-600 mt-1 font-normal">GFR 2017 &amp; CVC Aligned</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-neutral-950 tracking-tight">18+</div>
              <p className="text-xs text-neutral-600 mt-1 font-normal">Central Depts Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Capabilities Grid: Minimalist White & Emerald Cards */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto" id="capabilities">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-widest">
            Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-950 mt-2 tracking-tight">
            Engineered for precision procurement
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-3 font-normal leading-relaxed">
            Four specialized tools built to resolve colloquial ambiguity, enforce statutory Quality Control Orders, and protect public procurement integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Spec Recommender */}
          <div
            onClick={() => navigate('/spec-recommender')}
            className="group bg-white border border-neutral-200/90 hover:border-emerald-600/50 rounded-xl p-6 sm:p-7 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BookOpen className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold text-neutral-950 group-hover:text-emerald-600 transition-colors">
                Specification Recommender
              </h3>
              <p className="text-xs text-neutral-600 mt-2 font-normal leading-relaxed">
                Translate colloquial BoQ terms into exact Bureau of Indian Standards codes with full parameter ranges, testing methods, and grade classifications.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform">
              <span>Open Recommender</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 2: QCO Tracker */}
          <div
            onClick={() => navigate('/qco-tracker')}
            className="group bg-white border border-neutral-200/90 hover:border-emerald-600/50 rounded-xl p-6 sm:p-7 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold text-neutral-950 group-hover:text-emerald-600 transition-colors">
                Statutory QCO Tracker
              </h3>
              <p className="text-xs text-neutral-600 mt-2 font-normal leading-relaxed">
                Monitor mandatory Gazette Quality Control Orders notified under Section 16 of the BIS Act 2016 to prevent criminal liability and audit rejections.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform">
              <span>Track Orders</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 3: Tender Auditor */}
          <div
            onClick={() => navigate('/tender-auditor')}
            className="group bg-white border border-neutral-200/90 hover:border-emerald-600/50 rounded-xl p-6 sm:p-7 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <FileCheck className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold text-neutral-950 group-hover:text-emerald-600 transition-colors">
                Tender Clause Auditor
              </h3>
              <p className="text-xs text-neutral-600 mt-2 font-normal leading-relaxed">
                Perform reverse gap analysis on draft tender clauses, RFP specs, and GeM custom bids to ensure strict conformity with GFR 2017 Rule 144(xi).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform">
              <span>Audit Clause</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 4: Normative Graph */}
          <div
            onClick={() => navigate('/normative-graph')}
            className="group bg-white border border-neutral-200/90 hover:border-emerald-600/50 rounded-xl p-6 sm:p-7 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Network className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold text-neutral-950 group-hover:text-emerald-600 transition-colors">
                Normative Knowledge Graph
              </h3>
              <p className="text-xs text-neutral-600 mt-2 font-normal leading-relaxed">
                Traverse multi-tier normative dependencies, cross-referenced test protocols, and supersession lineages across national standardization repositories.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform">
              <span>Explore Graph</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. High-Contrast Verification Workflow (White, Black, Emerald) */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                Verification Workflow
              </span>
              <h3 className="text-lg font-semibold text-neutral-950 mt-1">
                How ManakAI resolves procurement ambiguity
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>View live example in console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Left: Colloquial Input (Neutral Box) */}
            <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-600">
                Draft BoQ (Ambiguous &amp; Non-Compliant)
              </span>
              <div className="mt-3 p-3 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-700 font-mono">
                "Procurement of 150 MT high tensile steel rods 16mm for highway bridge girders, best commercial quality."
              </div>
              <ul className="mt-4 space-y-2 text-xs text-neutral-600">
                <li className="flex items-center gap-2">
                  <span className="text-neutral-400">✕</span> Missing exact Bureau of Indian Standards code
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neutral-400">✕</span> No reference to mandatory QCO certification
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neutral-400">✕</span> Fails GFR 2017 Rule 144(xi) audit muster
                </li>
              </ul>
            </div>

            {/* Right: ManakAI Codified Result (White with Emerald Highlights) */}
            <div className="bg-white rounded-xl p-5 border border-emerald-600/40 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">
                ManakAI Codified Verification
              </span>
              <div className="mt-3 p-3 bg-emerald-50/70 rounded border border-emerald-200 text-xs text-neutral-900">
                <div className="font-semibold text-neutral-950">IS 1786:2008 (Grade Fe 500D)</div>
                <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Mandatory QCO: Steel and Steel Products Order, Section 16
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-neutral-700">
                <li className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Yield strength: Min 500 N/mm² specified
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> Carbon equivalent: Max 0.42% verified
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> 100% CVC &amp; GeM compliant clause generated
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action (White, Black, Emerald) */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-neutral-950 tracking-tight">
          Ready to streamline procurement compliance?
        </h2>
        <p className="text-sm text-neutral-600 mt-3 max-w-xl mx-auto font-normal leading-relaxed">
          Access the complete Indian Standards directory, active QCO database, and dispute-proof tender drafting tools.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Launch Workspace
          </button>
          <Link
            to="/login"
            className="text-neutral-700 hover:text-black text-sm font-medium transition-colors"
          >
            Sign in to existing account →
          </Link>
        </div>
      </section>

      {/* 8. Minimalist Footer (Clean White / Subtle Light Grey) */}
      <footer className="border-t border-neutral-200 py-12 bg-neutral-50/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-600 text-base tracking-tight">
              ManakAI
            </span>
            <span className="text-xs text-neutral-300">|</span>
            <span className="text-xs text-neutral-600 font-normal">
              Standards &amp; Procurement Intelligence
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-600 font-normal">
            <Link to="/spec-recommender" className="hover:text-black transition-colors">
              Standards
            </Link>
            <Link to="/qco-tracker" className="hover:text-black transition-colors">
              QCO Tracker
            </Link>
            <Link to="/tender-auditor" className="hover:text-black transition-colors">
              Tender Auditor
            </Link>
            <Link to="/settings" className="hover:text-black transition-colors">
              Settings
            </Link>
          </div>

          <div className="text-xs text-neutral-500 font-normal">
            © {new Date().getFullYear()} ManakAI. BIS Act 2016 Compliant.
          </div>
        </div>
      </footer>
    </div>
  );
}

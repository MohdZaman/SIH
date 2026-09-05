import React from 'react';

export default function IsometricStandardsGrid() {
  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[580px] bg-[#07080C] overflow-hidden flex items-center justify-center select-none">
      {/* Ambient Blue Backlight Glows */}
      <div className="absolute -top-16 -left-16 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Background Matrix Blueprint Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="iso-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="#1E293B" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#iso-grid)" />
      </svg>

      {/* Main Isometric Industrial Site SVG Model */}
      <svg
        viewBox="0 0 800 650"
        className="w-full h-full max-w-[680px] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue Neon Glow Filters */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="metal-base-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B1F2A" />
            <stop offset="100%" stopColor="#0B0D13" />
          </linearGradient>

          <linearGradient id="metal-base-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#161821" />
            <stop offset="100%" stopColor="#08090D" />
          </linearGradient>

          <linearGradient id="neon-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>

          <linearGradient id="blue-glass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* ============================================================ */}
        {/* 1. DARK BASE ISOMETRIC FOUNDATION PLATFORMS */}
        {/* ============================================================ */}
        {/* Base Platform 1 (Upper Left Facility Floor) */}
        <polygon points="120,160 380,80 500,160 240,240" fill="url(#metal-base-1)" stroke="#232938" strokeWidth="1.5" />
        <polygon points="120,160 240,240 240,255 120,175" fill="#0A0C11" />
        <polygon points="240,240 500,160 500,175 240,255" fill="#10131B" />

        {/* Base Platform 2 (Center Plant Floor) */}
        <polygon points="260,260 560,160 700,245 400,345" fill="url(#metal-base-1)" stroke="#232938" strokeWidth="1.5" />
        <polygon points="260,260 400,345 400,365 260,280" fill="#0A0C11" />
        <polygon points="400,345 700,245 700,265 400,365" fill="#10131B" />

        {/* Base Platform 3 (Lower Left Substation Floor) */}
        <polygon points="60,370 280,270 410,350 190,450" fill="url(#metal-base-2)" stroke="#232938" strokeWidth="1.5" />
        <polygon points="60,370 190,450 190,470 60,390" fill="#08090E" />
        <polygon points="190,450 410,350 410,370 190,470" fill="#0E1118" />

        {/* ============================================================ */}
        {/* 2. LOWER-LEFT GLOWING BLUE SUBSTATION / STRUCTURAL GRID */}
        {/* ============================================================ */}
        {/* Ambient Underglow */}
        <ellipse cx="230" cy="380" rx="140" ry="70" fill="#0066FF" opacity="0.18" filter="url(#soft-glow)" />

        {/* Substation Base Structure */}
        <polygon points="100,390 260,310 360,365 200,445" fill="#0D1017" stroke="#0088FF" strokeWidth="1" strokeOpacity="0.4" />

        {/* Glowing Matrix Structural Racks (Tier 1) */}
        {[0, 15, 30, 45, 60].map((step, idx) => (
          <g key={`rack-${idx}`}>
            {/* Horizontal Glowing Beams */}
            <path
              d={`M ${110 + step * 1.8},${410 - step} L ${240 + step * 1.8},${345 - step}`}
              stroke="#00D2FF"
              strokeWidth="2.5"
              filter="url(#neon-glow)"
              opacity="0.95"
            />
            <path
              d={`M ${240 + step * 1.8},${345 - step} L ${330 + step * 1.8},${390 - step}`}
              stroke="#0088FF"
              strokeWidth="2"
              opacity="0.85"
            />

            {/* Vertical Support Struts */}
            <line x1={110 + step * 1.8} y1={410 - step} x2={110 + step * 1.8} y2={440 - step} stroke="#0077FF" strokeWidth="2" />
            <line x1={240 + step * 1.8} y1={345 - step} x2={240 + step * 1.8} y2={375 - step} stroke="#00E5FF" strokeWidth="2.5" filter="url(#neon-glow)" />
            <line x1={330 + step * 1.8} y1={390 - step} x2={330 + step * 1.8} y2={420 - step} stroke="#0066FF" strokeWidth="1.5" />
          </g>
        ))}

        {/* Cross Bracing Lattices */}
        <line x1="110" y1="410" x2="240" y2="300" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
        <line x1="240" y1="345" x2="330" y2="340" stroke="#0088FF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

        {/* Transformer Units */}
        <polygon points="140,385 180,365 210,380 170,400" fill="#0B132B" stroke="#00A2FF" strokeWidth="1.5" />
        <polygon points="140,385 170,400 170,418 140,403" fill="#060A14" />
        <polygon points="170,400 210,380 210,398 170,418" fill="#09101D" />

        {/* ============================================================ */}
        {/* 3. CENTER: SMART INDUSTRIAL TESTING COMPLEX */}
        {/* ============================================================ */}
        {/* Central Facility Glow */}
        <ellipse cx="480" cy="270" rx="160" ry="80" fill="#0075FF" opacity="0.2" filter="url(#soft-glow)" />

        {/* Tall Industrial Chimney / Exhaust Stack with Blue Neon Rim */}
        <g>
          <path d="M 330,130 L 342,125 L 342,275 L 330,280 Z" fill="#202635" stroke="#334155" strokeWidth="1" />
          <path d="M 342,125 L 350,130 L 350,270 L 342,275 Z" fill="#131722" />
          {/* Glowing Top Ring */}
          <ellipse cx="340" cy="128" rx="8" ry="4" fill="#00E5FF" filter="url(#neon-glow)" />
          {/* Vertical Laser Telemetry Stripe */}
          <line x1="336" y1="135" x2="336" y2="275" stroke="#00F0FF" strokeWidth="2" filter="url(#neon-glow)" />
        </g>

        {/* Main Processing Facility Block */}
        <polygon points="360,240 500,165 620,230 480,305" fill="#141824" stroke="#2D3748" strokeWidth="1.5" />
        <polygon points="360,240 480,305 480,335 360,270" fill="#0A0D14" />
        <polygon points="480,305 620,230 620,260 480,335" fill="#0F131C" />

        {/* Tier 2: Illuminated Cleanroom & Control Hub */}
        <polygon points="390,215 480,165 570,215 480,265" fill="url(#blue-glass)" stroke="#38BDF8" strokeWidth="1.5" filter="url(#neon-glow)" />
        <polygon points="390,215 480,265 480,285 390,235" fill="#0369A1" opacity="0.8" />
        <polygon points="480,265 570,215 570,235 480,285" fill="#0284C7" opacity="0.6" />

        {/* Rooftop Solar/Sensors & Ventilator Strips */}
        <line x1="410" y1="210" x2="440" y2="195" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <line x1="430" y1="220" x2="460" y2="205" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <line x1="450" y1="230" x2="480" y2="215" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />

        {/* Cooling System Conduits */}
        {[0, 12, 24, 36, 48].map((offset) => (
          <path
            key={`conduit-${offset}`}
            d={`M ${420 + offset * 1.5},${290 - offset * 0.7} L ${440 + offset * 1.5},${280 - offset * 0.7}`}
            stroke="#00E5FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />
        ))}

        {/* ============================================================ */}
        {/* 4. UPPER-LEFT FACILITY: QUALITY TESTING TOWERS & SILOS */}
        {/* ============================================================ */}
        {/* Storage Silos */}
        {[
          { cx: 200, cy: 150, r: 18, h: 30 },
          { cx: 245, cy: 130, r: 18, h: 30 },
          { cx: 290, cy: 110, r: 18, h: 30 },
        ].map((silo, idx) => (
          <g key={`silo-${idx}`}>
            <ellipse cx={silo.cx} cy={silo.cy} rx={silo.r} ry={silo.r * 0.5} fill="#181D2A" stroke="#334155" strokeWidth="1" />
            <path
              d={`M ${silo.cx - silo.r},${silo.cy} A ${silo.r} ${silo.r * 0.5} 0 0 0 ${silo.cx + silo.r} ${silo.cy} L ${silo.cx + silo.r},${silo.cy + silo.h} A ${silo.r} ${silo.r * 0.5} 0 0 1 ${silo.cx - silo.r} ${silo.cy + silo.h} Z`}
              fill="#0F131D"
              stroke="#242D3D"
            />
            {/* Cyan indicator ring */}
            <ellipse cx={silo.cx} cy={silo.cy + 12} rx={silo.r - 2} ry={(silo.r - 2) * 0.5} fill="none" stroke="#00E5FF" strokeWidth="1.2" opacity="0.7" />
          </g>
        ))}

        {/* Quality Tower Array */}
        <polygon points="140,140 175,120 200,135 165,155" fill="#141824" stroke="#0077FF" strokeWidth="1" />
        <line x1="150" y1="135" x2="150" y2="70" stroke="#00D2FF" strokeWidth="2.5" filter="url(#neon-glow)" />
        <line x1="165" y1="128" x2="165" y2="80" stroke="#00A2FF" strokeWidth="2" />
        <line x1="180" y1="120" x2="180" y2="75" stroke="#0077FF" strokeWidth="2" />

        {/* ============================================================ */}
        {/* 5. FLOATING TELEMETRY WIDGETS (Matching Reference Image) */}
        {/* ============================================================ */}
        {/* Floating Glowing Pill: "99.4% Standards Verified" */}
        <g className="animate-pulse" style={{ animationDuration: '3s' }}>
          <rect x="280" y="70" width="130" height="28" rx="14" fill="#0B132B" stroke="#00E5FF" strokeWidth="1.5" filter="url(#neon-glow)" />
          <circle cx="295" cy="84" r="4" fill="#00FFB2" />
          <text x="306" y="88" fill="#E2E8F0" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">
            BIS GRID ACTIVE
          </text>
        </g>

        {/* Floating Isometric Data Hub Card */}
        <g>
          <polygon points="530,110 590,75 640,105 580,140" fill="#0284C7" opacity="0.85" filter="url(#neon-glow)" />
          <polygon points="530,110 580,140 580,158 530,128" fill="#0369A1" />
          <polygon points="580,140 640,105 640,123 580,158" fill="#075985" />
          {/* Pulse beacon */}
          <circle cx="585" cy="108" r="4" fill="#FFFFFF" filter="url(#neon-glow)" />
        </g>

        {/* Connecting Laser Trace Lines across the campus */}
        <path
          d="M 240,345 L 342,275 L 420,290 L 530,225"
          fill="none"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeDasharray="6 4"
          filter="url(#neon-glow)"
          opacity="0.8"
        />
        <circle cx="342" cy="275" r="3.5" fill="#00FFFF" filter="url(#neon-glow)" />
        <circle cx="420" cy="290" r="3.5" fill="#00FFFF" filter="url(#neon-glow)" />
      </svg>

      {/* Bottom Overlay Label */}
      <div className="absolute bottom-6 left-8 flex items-center gap-3 z-10">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
          ManakAI • Smart Site & Standards Grid
        </span>
      </div>
    </div>
  );
}

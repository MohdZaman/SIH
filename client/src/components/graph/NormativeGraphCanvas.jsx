import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Info,
} from 'lucide-react';
import Badge from '../common/Badge';

export default function NormativeGraphCanvas({
  graphData,
  selectedNode,
  onSelectNode,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [filters, setFilters] = useState({
    safety: true,
    testMethods: true,
    qco: true,
  });

  const rootNode = graphData?.rootNode;
  const nodes = graphData?.nodes || [];

  const NODE_POSITIONS = {
    'IS-10322-P5': { x: 460, y: 200, width: 220, height: 90 },
    'IS-302-1': { x: 200, y: 90, width: 190, height: 80 },
    'IS-15885-2-13': { x: 720, y: 90, width: 190, height: 80 },
    'IS-1608': { x: 90, y: 320, width: 180, height: 80 },
    'IS-9000': { x: 310, y: 320, width: 180, height: 80 },
    'IS-12063': { x: 610, y: 320, width: 180, height: 80 },
    'IS-16103': { x: 830, y: 320, width: 180, height: 80 },
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.node-element') || e.target.closest('.hud-element')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (delta) => {
    setZoom((prev) => Math.max(0.6, Math.min(1.8, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden select-none">
      {/* Background Architectural Grid for Graph */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating HUD Controls Bar */}
      <div className="hud-element absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-[#161B26]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-xl">
        <button
          onClick={() => handleZoom(0.15)}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.15)}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Fit to Screen"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <span className="text-xs font-mono text-slate-400 px-2">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Filter Toggles on Top Right */}
      <div className="hud-element absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-[#161B26]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300 shadow-xl">
        <Layers className="h-3.5 w-3.5 text-brand-blue mr-1" />
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.safety}
            onChange={(e) => setFilters({ ...filters, safety: e.target.checked })}
            className="rounded border-slate-700 bg-slate-800 text-brand-blue"
          />
          <span>Safety Codes</span>
        </label>
        <span className="text-slate-600">•</span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.testMethods}
            onChange={(e) => setFilters({ ...filters, testMethods: e.target.checked })}
            className="rounded border-slate-700 bg-slate-800 text-brand-blue"
          />
          <span>Test Methods</span>
        </label>
        <span className="text-slate-600">•</span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.qco}
            onChange={(e) => setFilters({ ...filters, qco: e.target.checked })}
            className="rounded border-slate-700 bg-slate-800 text-brand-blue"
          />
          <span>QCO Mandates</span>
        </label>
      </div>

      {/* Hint Badge on Bottom Left */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
        <Info className="h-3.5 w-3.5 text-brand-blue" />
        <span>Click any standard node to inspect test laboratories & clauses</span>
      </div>

      {/* SVG Canvas Area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <svg
          viewBox="0 0 1000 460"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            <linearGradient id="link-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Curved Cubic Bezier Links */}
          {graphData?.links?.map((link, idx) => {
            const src = NODE_POSITIONS[link.source];
            const tgt = NODE_POSITIONS[link.target];
            if (!src || !tgt) return null;

            const x1 = src.x + src.width / 2;
            const y1 = src.y + src.height / 2;
            const x2 = tgt.x + tgt.width / 2;
            const y2 = tgt.y + tgt.height / 2;

            const dx = (x2 - x1) * 0.5;
            const dy = (y2 - y1) * 0.5;
            const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

            return (
              <g key={idx}>
                <path
                  d={pathData}
                  fill="none"
                  stroke="rgba(37, 99, 235, 0.4)"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                {/* Edge relationship label */}
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  className="bg-slate-900"
                >
                  {link.label}
                </text>
              </g>
            );
          })}

          {/* Center Root Node */}
          {rootNode && (
            <g
              className="node-element cursor-pointer group"
              onClick={() => onSelectNode && onSelectNode(rootNode)}
              transform={`translate(${NODE_POSITIONS[rootNode.id]?.x || 390}, ${
                NODE_POSITIONS[rootNode.id]?.y || 190
              })`}
            >
              {/* Outer Glowing Border */}
              <rect
                width={NODE_POSITIONS[rootNode.id]?.width || 220}
                height={NODE_POSITIONS[rootNode.id]?.height || 90}
                rx="14"
                fill="#1E293B"
                stroke="#2563EB"
                strokeWidth={selectedNode?.id === rootNode.id ? '3' : '2'}
                filter="url(#glow)"
                className="transition-all duration-150"
              />
              <rect
                width={NODE_POSITIONS[rootNode.id]?.width || 220}
                height={NODE_POSITIONS[rootNode.id]?.height || 90}
                rx="14"
                fill="#1E293B"
                stroke="#3B82F6"
                strokeWidth="1.5"
              />
              <text x="14" y="24" fill="#60A5FA" fontSize="9" fontWeight="bold" letterSpacing="0.05em">
                ROOT PROCUREMENT STANDARD
              </text>
              <text x="14" y="44" fill="#FFFFFF" fontSize="13" fontWeight="bold">
                IS 10322 (Part 5/Sec 3)
              </text>
              <text x="14" y="60" fill="#94A3B8" fontSize="10">
                Road & Highway Streetlighting
              </text>
              <rect x="14" y="68" width="80" height="14" rx="4" fill="#10B981" fillOpacity="0.2" />
              <text x="18" y="79" fill="#34D399" fontSize="8" fontWeight="bold">
                MANDATORY QCO
              </text>
            </g>
          )}

          {/* Subordinate Nodes */}
          {nodes.map((node) => {
            const pos = NODE_POSITIONS[node.id];
            if (!pos) return null;
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                className="node-element cursor-pointer"
                onClick={() => onSelectNode && onSelectNode(node)}
                transform={`translate(${pos.x}, ${pos.y})`}
              >
                <rect
                  width={pos.width}
                  height={pos.height}
                  rx="10"
                  fill="#182234"
                  stroke={isSelected ? '#38BDF8' : '#334155'}
                  strokeWidth={isSelected ? '2' : '1'}
                  className="hover:stroke-blue-400 transition-colors"
                />
                <text x="12" y="20" fill="#94A3B8" fontSize="8" fontWeight="bold" letterSpacing="0.04em">
                  {node.type.toUpperCase()}
                </text>
                <text x="12" y="38" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                  {node.code.length > 18 ? `${node.code.slice(0, 18)}...` : node.code}
                </text>
                <text x="12" y="52" fill="#64748B" fontSize="9">
                  {node.title.length > 24 ? `${node.title.slice(0, 24)}...` : node.title}
                </text>
                <rect x="12" y="58" width="60" height="12" rx="3" fill="#2563EB" fillOpacity="0.2" />
                <text x="15" y="67" fill="#60A5FA" fontSize="8" fontWeight="bold">
                  {node.badge}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

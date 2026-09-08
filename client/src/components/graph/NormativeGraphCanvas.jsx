import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function NormativeGraphCanvas({
  graphData,
  selectedNode,
  onSelectNode,
  onInjectClause,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });
  const [customNodePositions, setCustomNodePositions] = useState({});

  const containerRef = useRef(null);

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];
  const standard = graphData?.standard;

  // Auto-select root node if none selected
  useEffect(() => {
    if (!selectedNode && nodes.length > 0) {
      const root = nodes.find((n) => n.isRoot) || nodes[0];
      if (root && onSelectNode) {
        onSelectNode(root);
      }
    }
  }, [graphData, selectedNode, nodes, onSelectNode]);

  // Reset custom node positions when graph standard changes
  useEffect(() => {
    setCustomNodePositions({});
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [standard?.code, standard?._id]);

  // Get effective position of a node (custom dragged or initial)
  const getNodePos = (node) => {
    if (!node) return { x: 400, y: 240 };
    if (customNodePositions[node.id]) {
      return customNodePositions[node.id];
    }
    return { x: node.x ?? 400, y: node.y ?? 240 };
  };

  // Canvas Pan Handlers
  const handleCanvasMouseDown = (e) => {
    // If clicking a node or HUD button, don't drag canvas
    if (e.target.closest('.interactive-node') || e.target.closest('.hud-control')) {
      return;
    }
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (draggingNodeId) {
      const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      const mouseX = (e.clientX - containerRect.left - pan.x) / zoom;
      const mouseY = (e.clientY - containerRect.top - pan.y) / zoom;

      setCustomNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: {
          x: Math.round(mouseX - nodeOffset.x),
          y: Math.round(mouseY - nodeOffset.y),
        },
      }));
      return;
    }

    if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
  };

  const handleZoom = (delta) => {
    setZoom((prev) => Math.max(0.4, Math.min(2.2, Number((prev + delta).toFixed(2)))));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    const pos = getNodePos(node);
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    const mouseX = (e.clientX - containerRect.left - pan.x) / zoom;
    const mouseY = (e.clientY - containerRect.top - pan.y) / zoom;

    setDraggingNodeId(node.id);
    setNodeOffset({
      x: mouseX - pos.x,
      y: mouseY - pos.y,
    });

    if (onSelectNode) {
      onSelectNode(node);
    }
  };

  // Bottom scrubber horizontal panning
  const handleScrubberChange = (e) => {
    const val = Number(e.target.value);
    // map 0..100 to pan -300..300
    const newPanX = -((val - 50) * 6);
    setPan((prev) => ({ ...prev, x: newPanX }));
  };

  const scrubberVal = Math.round(50 - pan.x / 6);

  // Node Color & Style Resolver according to the uploaded screenshot
  const getNodeStyle = (node) => {
    const isSelected = selectedNode?.id === node.id;

    if (node.isRoot) {
      // Bold Central Node: vibrant blue with dark navy/black border
      return {
        fill: '#1D4ED8', // Vibrant blue
        stroke: '#0F172A', // Dark navy/black thick ring
        strokeWidth: isSelected ? 5 : 4,
        titleColor: '#FFFFFF',
        subtitleColor: '#BFDBFE',
        filter: isSelected ? 'drop-shadow(0 0 10px rgba(29, 78, 216, 0.6))' : 'none',
      };
    }

    if (node.id === 'fe-500d' || node.category === 'obligation' && node.nodeType === 'material_rule') {
      // Light green/mint for Material rule
      return {
        fill: '#DCFCE7',
        stroke: isSelected ? '#10B981' : '#86EFAC',
        strokeWidth: isSelected ? 3 : 2,
        titleColor: '#065F46',
        subtitleColor: '#047857',
        filter: isSelected ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' : 'none',
      };
    }

    if (node.id === 'qco-2024' || node.nodeType === 'qco' || node.category === 'obligation' && node.sublabel?.includes('QCO')) {
      // Soft light-yellow/gold for QCO / Order
      return {
        fill: '#FEF3C7',
        stroke: isSelected ? '#D97706' : '#FDE047',
        strokeWidth: isSelected ? 3 : 2,
        titleColor: '#78350F',
        subtitleColor: '#B45309',
        filter: isSelected ? 'drop-shadow(0 0 8px rgba(217, 119, 6, 0.35))' : 'none',
      };
    }

    if (node.id === 'nabl-cert' || node.category === 'evidence') {
      // Soft lavender/purple for Evidence
      return {
        fill: '#F3E8FF',
        stroke: isSelected ? '#9333EA' : '#DDD6FE',
        strokeWidth: isSelected ? 3 : 2,
        titleColor: '#581C87',
        subtitleColor: '#7E22CE',
        filter: isSelected ? 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.35))' : 'none',
      };
    }

    if (node.id === 'clause-4-2' || node.nodeType === 'clause') {
      // Light grayish-blue for Tender clause
      return {
        fill: '#E2E8F0',
        stroke: isSelected ? '#2563EB' : '#CBD5E1',
        strokeWidth: isSelected ? 3 : 2,
        titleColor: '#0F172A',
        subtitleColor: '#64748B',
        filter: isSelected ? 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))' : 'none',
      };
    }

    // Default Source standard / test method: light blue
    return {
      fill: '#DBEAFE',
      stroke: isSelected ? '#2563EB' : '#BFDBFE',
      strokeWidth: isSelected ? 3 : 2,
      titleColor: '#0F172A',
      subtitleColor: '#64748B',
      filter: isSelected ? 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))' : 'none',
    };
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Canvas Card matching the image */}
      <div
        ref={containerRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[540px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        style={{ cursor: isDraggingCanvas ? 'grabbing' : 'grab' }}
      >
        {/* Subtle dot grid pattern on canvas */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#E2E8F0 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* TOP LEFT CONTROLS: Zoom In, Zoom Out, Fit to view */}
        <div className="hud-control absolute top-4 left-4 z-20 flex items-center gap-2">
          {/* Zoom In (+) */}
          <button
            onClick={() => handleZoom(0.15)}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="h-4 w-4 stroke-[2.2]" />
          </button>

          {/* Zoom Out (-) */}
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-4 w-4 stroke-[2.2]" />
          </button>

          {/* Fit to view pill button */}
          <button
            onClick={resetView}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Fit to view"
          >
            <span>Fit to view</span>
          </button>
        </div>

        {/* TOP RIGHT LEGEND: Source, Obligation, Evidence */}
        <div className="hud-control absolute top-4 right-5 z-20 flex items-center gap-5 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
            <span>Source</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            <span>Obligation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            <span>Evidence</span>
          </div>
        </div>

        {/* SVG GRAPH CANVAS */}
        <svg
          viewBox="0 0 1000 520"
          className="w-full h-full pointer-events-auto"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDraggingCanvas || draggingNodeId ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {/* DEFINITIONS */}
          <defs>
            <filter id="shadow-selected" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1D4ED8" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* EDGES / CONNECTING LINKS */}
          <g className="edges-layer">
            {edges.map((edge) => {
              const srcNode = nodes.find((n) => n.id === edge.source);
              const tgtNode = nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const p1 = getNodePos(srcNode);
              const p2 = getNodePos(tgtNode);

              // Calculate angle and midpoint
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              const isEdgeHighlighted =
                selectedNode?.id === edge.source || selectedNode?.id === edge.target;

              return (
                <g key={edge.id} className="edge-group">
                  {/* Base Connecting Line */}
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isEdgeHighlighted ? '#2563EB' : '#94A3B8'}
                    strokeWidth={isEdgeHighlighted ? '2' : '1.5'}
                    strokeOpacity={isEdgeHighlighted ? 0.9 : 0.75}
                    className="transition-colors duration-150"
                  />

                  {/* Edge Label Pill */}
                  {edge.label && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x={-(edge.label.length * 3.4 + 8)}
                        y="-9"
                        width={edge.label.length * 6.8 + 16}
                        height="18"
                        rx="9"
                        fill="#FFFFFF"
                        stroke={isEdgeHighlighted ? '#93C5FD' : '#E2E8F0'}
                        strokeWidth="1"
                        className="shadow-sm"
                      />
                      <text
                        x="0"
                        y="3.5"
                        fill={isEdgeHighlighted ? '#1D4ED8' : '#475569'}
                        fontSize="10"
                        fontWeight="500"
                        fontFamily="inherit"
                        textAnchor="middle"
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* NODES LAYER */}
          <g className="nodes-layer">
            {nodes.map((node) => {
              const pos = getNodePos(node);
              const style = getNodeStyle(node);
              const radius = node.radius || (node.isRoot ? 56 : 46);
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  className="interactive-node cursor-pointer group"
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectNode) onSelectNode(node);
                  }}
                  style={{ filter: style.filter }}
                >
                  {/* Outer selection ring if selected */}
                  {isSelected && (
                    <circle
                      r={radius + 6}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="animate-spin-slow opacity-80"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={radius}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    className="transition-transform duration-150 group-hover:scale-105"
                  />

                  {/* Node Label Text */}
                  <text
                    y={node.sublabel ? -4 : 4}
                    fill={style.titleColor}
                    fontSize={node.isRoot ? '15' : '13'}
                    fontWeight="700"
                    fontFamily="inherit"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.label}
                  </text>

                  {/* Node Sublabel Text */}
                  {node.sublabel && (
                    <text
                      y={node.isRoot ? 14 : 13}
                      fill={style.subtitleColor}
                      fontSize={node.isRoot ? '11' : '10'}
                      fontWeight="400"
                      fontFamily="inherit"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {node.sublabel}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* BOTTOM HORIZONTAL SCRUBBER / SLIDER BAR */}
        <div className="absolute bottom-3 inset-x-6 z-20 flex items-center gap-3">
          <button
            onClick={() => setPan((prev) => ({ ...prev, x: prev.x + 50 }))}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Pan Left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="relative flex-1 h-3 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={Math.max(0, Math.min(100, scrubberVal))}
              onChange={handleScrubberChange}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-ew-resize accent-slate-600 hover:accent-slate-800"
            />
          </div>

          <button
            onClick={() => setPan((prev) => ({ ...prev, x: prev.x - 50 }))}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Pan Right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

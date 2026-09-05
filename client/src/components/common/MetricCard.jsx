import React from 'react';
import Badge from './Badge';

// Helper to generate a smooth curved SVG path from array of numbers
function generateSparklinePath(points, width = 140, height = 46) {
  if (!points || points.length < 2) return { path: '', area: '' };

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((val, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 12) - 6;
    return { x, y };
  });

  // Smooth cubic Bezier string
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  const area = `${d} L ${width} ${height} L 0 ${height} Z`;
  return { path: d, area };
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendType = 'success', // 'success' | 'danger' | 'warning'
  icon: Icon,
  badgeIconBg = 'bg-blue-50 text-brand-blue',
  sparklineColor = '#2563EB',
  sparklineData = [20, 24, 22, 28, 32, 30, 42, 48],
}) {
  const { path, area } = generateSparklinePath(sparklineData, 140, 46);
  const gradientId = `grad-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`p-2 rounded-lg ${badgeIconBg} shrink-0`}>
              <Icon className="h-4 w-4" />
            </div>
          )}
          <span className="text-xs font-medium uppercase tracking-normal text-slate-500">
            {title}
          </span>
        </div>

        {trend && (
          <Badge variant={trendType} size="sm">
            {trend}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <div className="text-2xl lg:text-3xl font-semibold tracking-normal text-slate-900">
            {value}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs font-normal text-slate-500">{subtitle}</p>
          )}
        </div>

        {/* Smooth SVG Sparkline */}
        <div className="w-32 h-11 shrink-0 overflow-hidden">
          <svg viewBox="0 0 140 46" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gradientId})`} />
            <path
              d={path}
              fill="none"
              stroke={sparklineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

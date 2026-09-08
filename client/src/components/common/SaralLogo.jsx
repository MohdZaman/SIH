import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SaralLogo - Clean text-based logo for SARAL
 * 
 * Props:
 * - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * - theme: 'emerald' | 'light' | 'dark' | 'auto' (default: 'emerald')
 * - isCollapsed: boolean - renders clean single letter 'S' for mini sidebar
 * - asLink: boolean - wraps in Link to '/'
 * - to: string (default: '/')
 * - className: string
 */
export default function SaralLogo({
  size = 'md',
  theme = 'emerald',
  isCollapsed = false,
  asLink = false,
  to = '/',
  className = '',
}) {
  const sizeMap = {
    xs: 'text-sm font-semibold tracking-tight',
    sm: 'text-base font-semibold tracking-tight',
    md: 'text-lg font-semibold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
    xl: 'text-3xl font-extrabold tracking-tight',
  };

  const textSize = sizeMap[size] || sizeMap.md;

  const getThemeColor = () => {
    switch (theme) {
      case 'light': // On dark backgrounds
        return 'text-emerald-500 hover:text-emerald-400';
      case 'dark': // Dark text
        return 'text-slate-900 hover:text-black';
      case 'emerald':
      default:
        return 'text-emerald-600 hover:text-emerald-700';
    }
  };

  const textColor = getThemeColor();

  if (isCollapsed) {
    const collapsedContent = (
      <span
        className={`font-bold font-sans tracking-tight select-none transition-colors ${textSize} ${textColor} ${className}`}
        title="SARAL"
      >
        S
      </span>
    );

    if (asLink) {
      return (
        <Link to={to} className="inline-flex items-center focus:outline-none" title="Go to Landing Page">
          {collapsedContent}
        </Link>
      );
    }
    return collapsedContent;
  }

  const logoContent = (
    <span
      className={`font-sans tracking-tight select-none transition-colors ${textSize} ${textColor} ${className}`}
    >
      SARAL
    </span>
  );

  if (asLink) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none" title="Go to Landing Page">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
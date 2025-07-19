"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'gradient';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default',
  showText = true,
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
    xl: 'text-4xl font-bold'
  };

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          primary: 'text-white',
          secondary: 'text-gray-200',
          icon: 'fill-white'
        };
      case 'gradient':
        return {
          primary: 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent',
          secondary: 'text-green-700',
          icon: 'fill-green-600'
        };
      default:
        return {
          primary: 'text-green-600',
          secondary: 'text-gray-700',
          icon: 'fill-green-600'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Golf Course Icon */}
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 100 100"
          className={cn("w-full h-full", colors.icon)}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Golf Flag */}
          <g>
            {/* Flagpole */}
            <rect x="45" y="15" width="2" height="70" className="fill-current" />
            
            {/* Flag */}
            <path
              d="M47 15 L47 35 L70 30 L70 20 Z"
              className="fill-current opacity-80"
            />
            
            {/* Golf Ball */}
            <circle cx="35" cy="75" r="4" className="fill-white stroke-current stroke-1" />
            <circle cx="33" cy="73" r="0.5" className="fill-current" />
            <circle cx="37" cy="73" r="0.5" className="fill-current" />
            <circle cx="35" cy="77" r="0.5" className="fill-current" />
            
            {/* Golf Tee */}
            <rect x="34" y="79" width="2" height="6" className="fill-current opacity-60" />
            
            {/* Grass/Ground */}
            <ellipse cx="50" cy="85" rx="40" ry="8" className="fill-current opacity-30" />
            
            {/* Trees/Background */}
            <circle cx="20" cy="60" r="8" className="fill-current opacity-20" />
            <circle cx="80" cy="50" r="10" className="fill-current opacity-20" />
            <circle cx="75" cy="65" r="6" className="fill-current opacity-20" />
          </g>
        </svg>
      </div>

      {/* Text Logo */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn(textSizeClasses[size], colors.primary)}>
            Golf<span className={colors.secondary}>Ezz</span>
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className={cn("text-xs uppercase tracking-wider", colors.secondary)}>
              Course Management
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Logo;

// Alternative Golf Club Icon Component
export const GolfClubIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className, 
  size = 24 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 18h20" />
    <path d="M6 18v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6" />
    <path d="M10 12V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
    <circle cx="12" cy="4" r="1" />
  </svg>
);

// Golf Ball Icon Component
export const GolfBallIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className, 
  size = 24 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="8" r="0.5" fill="currentColor" />
    <circle cx="16" cy="8" r="0.5" fill="currentColor" />
    <circle cx="8" cy="16" r="0.5" fill="currentColor" />
    <circle cx="16" cy="16" r="0.5" fill="currentColor" />
    <circle cx="12" cy="6" r="0.5" fill="currentColor" />
    <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    <circle cx="6" cy="12" r="0.5" fill="currentColor" />
    <circle cx="18" cy="12" r="0.5" fill="currentColor" />
  </svg>
);

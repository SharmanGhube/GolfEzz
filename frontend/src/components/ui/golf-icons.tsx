import React from 'react';
import { 
  GiGolfFlag, 
  GiGolfTee, 
  GiTargetPrize,
  GiTrophy,
  GiStopwatch
} from 'react-icons/gi';
import { 
  MdGolfCourse,
  MdDateRange,
  MdPayment,
  MdDashboard,
  MdAnalytics,
  MdNotifications
} from 'react-icons/md';
import { 
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSun,
  FaStar,
  FaChartLine
} from 'react-icons/fa';
import {
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineSun,
  HiOutlineStar,
  HiOutlineChartBar,
  HiOutlineCash
} from 'react-icons/hi';
import { cn } from '@/lib/utils';

interface IconProps {
  size?: number;
  className?: string;
  variant?: 'filled' | 'outline';
}

// Golf Course Related Icons
export const CourseIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <MdGolfCourse size={size} className={cn('text-green-600', className)} /> :
    <GiGolfFlag size={size} className={cn('text-green-600', className)} />
);

export const TeeTimeIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <FaCalendarAlt size={size} className={cn('text-blue-600', className)} /> :
    <HiOutlineCalendar size={size} className={cn('text-blue-600', className)} />
);

export const RangeIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <GiTargetPrize size={size} className={cn('text-orange-600', className)} />
);

export const TeeIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <GiGolfTee size={size} className={cn('text-green-700', className)} />
);

export const ClubIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <GiGolfTee size={size} className={cn('text-gray-700', className)} />
);

// User & Management Icons
export const MembersIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <FaUsers size={size} className={cn('text-purple-600', className)} /> :
    <HiOutlineUserGroup size={size} className={cn('text-purple-600', className)} />
);

export const AdminIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <FaUserTie size={size} className={cn('text-red-600', className)} />
);

export const DashboardIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <MdDashboard size={size} className={cn('text-indigo-600', className)} />
);

// Time & Scheduling Icons
export const TimeIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <FaClock size={size} className={cn('text-blue-500', className)} /> :
    <HiOutlineClock size={size} className={cn('text-blue-500', className)} />
);

export const ScheduleIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <MdDateRange size={size} className={cn('text-emerald-600', className)} /> :
    <HiOutlineCalendar size={size} className={cn('text-emerald-600', className)} />
);

export const StopwatchIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <GiStopwatch size={size} className={cn('text-yellow-600', className)} />
);

// Location & Weather Icons
export const LocationIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <FaMapMarkerAlt size={size} className={cn('text-red-500', className)} /> :
    <HiOutlineLocationMarker size={size} className={cn('text-red-500', className)} />
);

export const WeatherIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <FaSun size={size} className={cn('text-yellow-500', className)} /> :
    <HiOutlineSun size={size} className={cn('text-yellow-500', className)} />
);

// Analytics & Performance Icons
export const AnalyticsIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <MdAnalytics size={size} className={cn('text-teal-600', className)} /> :
    <HiOutlineChartBar size={size} className={cn('text-teal-600', className)} />
);

export const TrendIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <FaChartLine size={size} className={cn('text-green-500', className)} />
);

export const StarIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <FaStar size={size} className={cn('text-yellow-400', className)} /> :
    <HiOutlineStar size={size} className={cn('text-yellow-400', className)} />
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <GiTrophy size={size} className={cn('text-gold-500', className)} />
);

// Payment & Business Icons
export const PaymentIcon: React.FC<IconProps> = ({ size = 24, className, variant = 'filled' }) => (
  variant === 'filled' ? 
    <MdPayment size={size} className={cn('text-green-600', className)} /> :
    <HiOutlineCash size={size} className={cn('text-green-600', className)} />
);

export const NotificationIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <MdNotifications size={size} className={cn('text-blue-500', className)} />
);

// Animated Loading Golf Ball
export const LoadingGolfBall: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center justify-center', className)}>
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
      <div className="absolute inset-2 rounded-full bg-white border border-gray-300">
        <div className="w-1 h-1 bg-gray-400 rounded-full absolute top-1 left-1"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full absolute top-1 right-1"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full absolute bottom-1 left-1"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full absolute bottom-1 right-1"></div>
      </div>
    </div>
  </div>
);

// Feature Badge Component
export const FeatureBadge: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'teal';
  className?: string;
}> = ({ icon, title, description, color = 'green', className }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    teal: 'bg-teal-50 border-teal-200 text-teal-800'
  };

  return (
    <div className={cn(
      'p-4 rounded-lg border-2 hover:shadow-md transition-all duration-200',
      colorClasses[color],
      className
    )}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
};

export default {
  CourseIcon,
  TeeTimeIcon,
  RangeIcon,
  TeeIcon,
  ClubIcon,
  MembersIcon,
  AdminIcon,
  DashboardIcon,
  TimeIcon,
  ScheduleIcon,
  LocationIcon,
  WeatherIcon,
  AnalyticsIcon,
  TrendIcon,
  StarIcon,
  TrophyIcon,
  PaymentIcon,
  NotificationIcon,
  LoadingGolfBall,
  FeatureBadge
};

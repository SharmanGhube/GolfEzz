/**
 * Authentication utility functions
 */

import type { User } from '@/types/api';

/**
 * Get the appropriate dashboard URL based on user role and membership type
 */
export function getDashboardUrl(user: User): string {
  if (user.role === 'admin' || user.role === 'super_admin') {
    return '/admin/dashboard';
  }
  
  if (user.role === 'member') {
    // Route to specific dashboard based on membership type
    switch (user.membership_type) {
      case 'basic':
        return '/member/basic/dashboard';
      case 'premium':
        return '/member/premium/dashboard';
      case 'vip':
        return '/member/vip/dashboard';
      default:
        return '/member/dashboard'; // fallback to general member dashboard
    }
  }
  
  return '/member/dashboard'; // default fallback
}

/**
 * Check if user has admin privileges
 */
export function isAdminUser(user: User): boolean {
  return user.role === 'admin' || user.role === 'super_admin';
}

/**
 * Check if user is a member
 */
export function isMemberUser(user: User): boolean {
  return user.role === 'member';
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'super_admin':
      return 'Super Administrator';
    case 'admin':
      return 'Administrator';
    case 'member':
      return 'Member';
    default:
      return 'User';
  }
}

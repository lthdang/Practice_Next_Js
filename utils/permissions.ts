// Permission utility functions for role-based access control

export interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  role_name: string;
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): any | null => {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Check if current user has permission to edit
 * Only super_admin and sub_admin can edit
 */
export const canEditContent = (): boolean => {
  const user = getCurrentUser();
  if (!user || !user.role || !user.role.role_name) return false;

  const roleName = user.role.role_name.toLowerCase();
  return roleName === 'super_admin' || roleName === 'sub_admin';
};

/**
 * Check if a specific user or role is super_admin
 */
export const isSuperAdmin = (item: {
  role_name?: string;
  role?: { role_name: string };
}): boolean => {
  const roleName = item.role_name || item.role?.role_name;
  return roleName?.toLowerCase() === 'super_admin';
};

/**
 * Check if current logged-in user is super_admin
 */
export const isCurrentUserSuperAdmin = (): boolean => {
  const user = getCurrentUser();
  if (!user || !user.role || !user.role.role_name) return false;

  return user.role.role_name.toLowerCase() === 'super_admin';
};

/**
 * Check if current logged-in user is sub_admin
 */
export const isCurrentUserSubAdmin = (): boolean => {
  const user = getCurrentUser();
  if (!user || !user.role || !user.role.role_name) return false;

  return user.role.role_name.toLowerCase() === 'sub_admin';
};

/**
 * Get user permissions object
 */
export const getUserPermissions = (): UserPermissions => {
  const user = getCurrentUser();

  if (!user || !user.role || !user.role.role_name) {
    return {
      canEdit: false,
      canDelete: false,
      canCreate: false,
      role_name: 'guest',
    };
  }

  const roleName = user.role.role_name.toLowerCase();
  const isAdminRole = roleName === 'super_admin' || roleName === 'sub_admin';

  return {
    canEdit: isAdminRole,
    canDelete: isAdminRole,
    canCreate: isAdminRole,
    role_name: user.role.role_name,
  };
};

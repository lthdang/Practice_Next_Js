/**
 * Get authentication headers for API requests
 * Reads user_id and role_id from localStorage
 */
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);

      if (user.user_id) {
        headers['x-user-id'] = String(user.user_id);
      }

      if (user.role_id) {
        headers['x-role-id'] = String(user.role_id);
      }
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  return headers;
}

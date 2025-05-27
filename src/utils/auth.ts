/**
 * Token 管理工具函数
 */

// 从localStorage获取token
export const getTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// 从localStorage获取refresh token
export const getRefreshTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
};

// 设置认证token到localStorage
export const setAuthTokens = (
  accessToken: string,
  refreshToken: string,
): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

// 清除认证token
export const clearAuthTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
};

// 判断是否为认证错误
export const isAuthError = (error: any): boolean => {
  return (
    error?.response?.status === 401 ||
    error?.code === 401 ||
    error?.code === 40001 ||
    error?.code === 40002
  );
};

// 判断是否为网络错误
export const isNetworkError = (error: any): boolean => {
  return (
    !error?.response ||
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Network Error') ||
    error?.message?.includes('fetch')
  );
};

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

// 从localStorage获取token过期时间
export const getTokenExpiresAt = (): number | null => {
  if (typeof window === 'undefined') return null;
  const expiresAt = localStorage.getItem('token_expires_at');
  return expiresAt ? parseInt(expiresAt, 10) : null;
};

// 设置认证token到localStorage
export const setAuthTokens = (
  accessToken: string,
  refreshToken: string,
  expiresAt?: number,
): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  if (expiresAt) {
    localStorage.setItem('token_expires_at', expiresAt.toString());
  }
};

// 清除认证token
export const clearAuthTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
};

// 检查token是否即将过期（提前5分钟刷新）
export const isTokenExpiringSoon = (): boolean => {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return false;

  const now = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
  const bufferTime = 5 * 60; // 提前5分钟刷新

  return expiresAt - now <= bufferTime;
};

// 检查token是否已过期
export const isTokenExpired = (): boolean => {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return false;

  const now = Math.floor(Date.now() / 1000);
  return now >= expiresAt;
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

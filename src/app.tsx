import { request as requestConfig } from '@/api';
import { GetUserInfo } from '@/api/user';
import {
  clearAuthTokens,
  getRefreshTokenFromStorage,
  getTokenFromStorage,
  isTokenExpired,
} from '@/utils/auth';

// 全局初始化数据配置
export async function getInitialState() {
  const baseState = {
    name: 'blog-web',
    isLoggedIn: false,
    currentUser: null,
  };

  const token = getTokenFromStorage();
  const refreshToken = getRefreshTokenFromStorage();

  if (!token || !refreshToken) {
    return baseState;
  }

  // 检查token是否已过期，如果过期直接清除并返回基础状态
  if (isTokenExpired()) {
    console.log('Token已过期，清除认证信息');
    clearAuthTokens();
    return baseState;
  }

  try {
    const response = await GetUserInfo({
      silent: true,
      skipAuthRefresh: true,
    });

    if (response.code === 0 && response.data?.user) {
      // 启动token刷新定时器
      const { startTokenRefreshTimer } = await import(
        '@/utils/tokenRefreshTimer'
      );
      startTokenRefreshTimer();

      return {
        ...baseState,
        currentUser: response.data.user,
        token,
        refreshToken,
        isLoggedIn: true,
      };
    }

    clearAuthTokens();
    return baseState;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      console.log('获取用户信息失败(401)，清除认证信息');
      clearAuthTokens();
      return baseState;
    }

    // 对于其他错误（如网络错误），不启动定时器，直接返回基础状态
    console.warn('获取用户信息失败:', error);
    clearAuthTokens();
    return baseState;
  }
}

export const request = requestConfig;

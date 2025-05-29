import { request as requestConfig } from '@/api';
import { GetUserInfo } from '@/api/user';
import {
  clearAuthTokens,
  getRefreshTokenFromStorage,
  getTokenFromStorage,
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

  try {
    const response = await GetUserInfo();

    if (response.code === 0 && response.data?.user) {
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
      clearAuthTokens();
      return baseState;
    }

    return {
      ...baseState,
      token,
      refreshToken,
      isLoggedIn: true,
    };
  }
}

export const request = requestConfig;

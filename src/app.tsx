import { request as requestConfig } from '@/api';
import { GetUserInfo } from '@/api/user';
import {
  clearAuthTokens,
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

  // 如果没有token或token已过期，直接返回基础状态
  if (!token || isTokenExpired()) {
    clearAuthTokens();
    return baseState;
  }

  try {
    // 尝试获取用户信息
    const response = await GetUserInfo({
      silent: true,
      skipAuthRefresh: true,
    });

    if (response.code === 0 && response.data?.user) {
      return {
        ...baseState,
        currentUser: response.data.user,
        isLoggedIn: true,
      };
    }

    // 获取用户信息失败，清除token
    clearAuthTokens();
    return baseState;
  } catch (error) {
    // 任何错误都清除token并返回基础状态
    console.warn('获取用户信息失败:', error);
    clearAuthTokens();
    return baseState;
  }
}

export const request = requestConfig;

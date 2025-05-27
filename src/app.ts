import { request as requestConfig } from '@/api';
import { GetUserInfo } from '@/api/user';
import { getRefreshTokenFromStorage, getTokenFromStorage } from '@/utils/auth';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  currentUser?: any;
  token?: string;
  refreshToken?: string;
  isLoggedIn: boolean;
}> {
  // 基础状态
  const initialState = {
    name: 'blog-web',
    isLoggedIn: false,
  };

  // 检查本地存储的token
  const token = getTokenFromStorage();
  const refreshToken = getRefreshTokenFromStorage();
  console.log('initialState');
  console.log('token', token);
  console.log('refreshToken', refreshToken);
  console.log('initialState');
  if (token && refreshToken) {
    console.log('发现本地token，尝试验证用户身份');
    try {
      // 验证token有效性并获取用户信息（静默模式，不显示错误消息，也不尝试刷新token）
      const response = await GetUserInfo({
        silent: true,
        skipAuthRefresh: true,
      });
      console.log(token);
      console.log('GetUserInfo response:', response);

      if (response.code === 0) {
        // token有效，返回完整的用户状态
        console.log('Token有效，用户已登录');
        return {
          ...initialState,
          currentUser: response.data.user,
          token,
          refreshToken,
          isLoggedIn: true,
        };
      }
    } catch (error: any) {
      console.log('GetUserInfo请求失败:', error);

      // 如果是401错误，说明token可能过期了，清除本地存储
      if (error?.response?.status === 401) {
        console.log('Token可能已过期，清除本地存储');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        return initialState;
      }
    }

    // 如果不是401错误，保留token状态，让后续的API拦截器处理
    console.log('保留token状态，让API拦截器处理token刷新');
    return {
      ...initialState,
      token,
      refreshToken,
      isLoggedIn: true,
    };
  }

  return initialState;
}

// 导出完整的request配置，供Umi使用
export const request = requestConfig;

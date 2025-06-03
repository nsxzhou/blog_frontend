import { clearAuthTokens, getTokenFromStorage } from '@/utils/auth';
import type { RequestConfig, RequestOptions } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';

// 定义基础响应数据接口
export interface baseResponse<T> {
  code: number;
  message: string;
  data: T;
}

const redirectToLogin = () => {
  console.log('清除token并跳转到登录页');
  clearAuthTokens();
  // 避免在登录页重复跳转
  if (history.location.pathname !== '/login') {
    history.push('/login');
  }
};

export const request: RequestConfig = {
  requestInterceptors: [
    (config: RequestOptions) => {
      // 添加token到请求头
      const token = getTokenFromStorage();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response) => {
      return response;
    },
  ],
  errorConfig: {
    async errorHandler(error: any, opts: any) {
      // 如果配置了跳过错误处理，直接抛出
      if (opts?.skipErrorHandler) {
        throw error;
      }

      // 处理401未授权错误
      const isUnauthorized =
        error?.response?.data?.code === 401 || error?.response?.status === 401;

      if (isUnauthorized) {
        message.error('登录已过期，请重新登录');
        redirectToLogin();
        return;
      }

      // 其他错误的统一处理
      const errorMessage =
        error?.response?.data?.message || error?.message || '请求发生错误';

      // 网络错误
      if (!error?.response) {
        message.error('网络连接失败，请检查网络');
        throw error;
      }

      // 业务错误
      message.error(errorMessage);
      throw error;
    },
  },
};

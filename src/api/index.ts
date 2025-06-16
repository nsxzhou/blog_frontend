import {
  clearAuthTokens,
  getRefreshTokenFromStorage,
  getTokenFromStorage,
  setAuthTokens,
} from '@/utils/auth';
import type { RequestConfig, RequestOptions } from '@umijs/max';
import { history, request as umiRequest } from '@umijs/max';
import { message } from 'antd';

// 定义基础响应数据接口
export interface baseResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface RefreshTokenRes {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string | null> | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async refreshToken(): Promise<string | null> {
    // 如果已经在刷新，返回现有的Promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshTokenValue = getRefreshTokenFromStorage();
    if (!refreshTokenValue) {
      return null;
    }

    // 创建新的刷新Promise
    this.refreshPromise = (async () => {
      try {
        const response = await umiRequest<baseResponse<RefreshTokenRes>>(
          '/api/users/refresh',
          {
            method: 'POST',
            data: { refresh_token: refreshTokenValue },
            skipErrorHandler: true,
          },
        );

        if (response.code === 0 && response.data) {
          const { access_token, refresh_token, expires_at } = response.data;
          setAuthTokens(access_token, refresh_token, expires_at);
          return access_token;
        }
        return null;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }
}

const tokenManager = TokenManager.getInstance();

const redirectToLogin = () => {
  console.log('清除token并跳转到登录页');
  clearAuthTokens();
  // 避免在登录页重复跳转
  if (history.location.pathname !== '/login') {
    history.push('/login');
  }
};

// 用于防止并发刷新token的标志
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// 刷新token函数
const refreshToken = async (): Promise<string | null> => {
  const refreshTokenValue = getRefreshTokenFromStorage();

  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await umiRequest<baseResponse<RefreshTokenRes>>(
      '/api/users/refresh',
      {
        method: 'POST',
        data: { refresh_token: refreshTokenValue },
        skipErrorHandler: true, // 跳过错误处理器，避免递归
      },
    );

    if (response.code === 0 && response.data) {
      const { access_token, refresh_token, expires_at } = response.data;
      setAuthTokens(access_token, refresh_token, expires_at);
      return access_token;
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('刷新token失败:', error);
    throw error;
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
      console.log(error);
      // 如果配置了跳过错误处理，直接抛出
      if (opts?.skipErrorHandler) {
        throw error;
      }

      // 处理401未授权错误
      const isUnauthorized =
        error?.response?.data?.code === 401 || error?.response?.status === 401;

      if (isUnauthorized) {
        const originalRequest = error.config;

        // 检查是否有refresh token，如果没有直接跳转登录页
        const refreshTokenValue = getRefreshTokenFromStorage();
        if (!refreshTokenValue) {
          message.error('登录已过期，请重新登录');
          redirectToLogin();
          throw error;
        }

        // 如果已经在刷新token，将请求加入队列
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              // 重新发起原请求
              const token = getTokenFromStorage();
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return umiRequest(originalRequest);
            })
            .catch((err) => {
              throw err;
            });
        }

        // 开始刷新token流程
        isRefreshing = true;

        try {
          const newToken = await tokenManager.refreshToken();

          // 刷新成功，处理队列中的请求
          processQueue(null, newToken);

          // 更新原请求的token并重新发起
          if (newToken && originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return umiRequest(originalRequest);
          }
        } catch (refreshError) {
          // 刷新失败，处理队列中的请求
          processQueue(refreshError, null);

          // 跳转到登录页
          message.error('登录已过期，请重新登录');
          redirectToLogin();
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
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

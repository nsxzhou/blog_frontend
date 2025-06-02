import {
  clearAuthTokens,
  getRefreshTokenFromStorage,
  getTokenFromStorage,
  isTokenExpiringSoon,
} from '@/utils/auth';
import type { RequestConfig, RequestOptions } from '@umijs/max';
import { request as umiRequest } from '@umijs/max';
import { message } from 'antd';

// 定义基础响应数据接口
export interface baseResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 防止重复刷新token的标志
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];
let refreshPromise: Promise<any> | null = null;

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

const redirectToLogin = () => {
  console.log('清除token并跳转到登录页');
  clearAuthTokens();
  window.location.href = '/login';
};

// 无感刷新token函数
const silentRefreshToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshTokenFromStorage();
  if (!refreshToken) {
    redirectToLogin();
    return null;
  }

  try {
    // 使用直接的umiRequest调用，避免拦截器干扰
    const refreshRes = await umiRequest('/api/users/refresh', {
      method: 'POST',
      data: { refresh_token: refreshToken },
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (refreshRes?.code === 0 && refreshRes?.data?.access_token) {
      const {
        access_token,
        refresh_token: newRefreshToken,
        expires_at,
      } = refreshRes.data;

      // 保存新token
      localStorage.setItem('token', access_token);
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }
      if (expires_at) {
        localStorage.setItem('token_expires_at', expires_at.toString());
      }

      return access_token;
    } else {
      redirectToLogin();
      return null;
    }
  } catch (error) {
    console.error('Silent refresh failed:', error);
    redirectToLogin();
    return null;
  }
};

export const request: RequestConfig = {
  requestInterceptors: [
    async (config: RequestOptions) => {
      // 安全检查：确保 config.url 存在
      if (
        config.url &&
        typeof config.url === 'string' &&
        config.url.includes('/refresh')
      ) {
        // 如果是刷新token接口，使用refresh_token
        const refreshToken = getRefreshTokenFromStorage();
        if (refreshToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${refreshToken}`,
          };
        }
        return config;
      }

      // 检查token是否即将过期
      if (isTokenExpiringSoon()) {
        console.log('Token即将过期，尝试无感刷新...');

        // 如果已经在刷新中，等待刷新完成
        if (isRefreshing) {
          if (refreshPromise) {
            try {
              await refreshPromise;
            } catch (error) {
              console.error('等待token刷新失败:', error);
            }
          }
        } else {
          // 开始刷新token
          isRefreshing = true;
          refreshPromise = silentRefreshToken().finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });

          try {
            await refreshPromise;
            console.log('Token刷新成功');
          } catch (error) {
            console.error('Token刷新失败:', error);
            // 如果刷新失败，让原始请求继续，会在errorHandler中处理
          }
        }
      }

      // 使用最新的token
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
      // 统一错误处理
      if ((response as any).ok === false) {
        message.error('请求出错，请稍后重试');
      }
      return response;
    },
  ],
  errorConfig: {
    async errorHandler(error: any, opts: any) {
      // 如果是应用初始化期间的错误，静默处理
      if (opts?.skipErrorHandler) {
        return Promise.reject(error);
      }

      // 安全检查401错误
      const isUnauthorized =
        error?.response?.data?.code === 401 || error?.response?.status === 401;

      if (isUnauthorized && !opts?.skipAuthRefresh) {
        console.log('401 error detected, 开始静默处理:', error?.response?.data);
        try {
          // 避免死循环：如果当前请求是刷新token接口，直接跳转登录
          if (
            error?.config?.url &&
            typeof error.config.url === 'string' &&
            error.config.url.includes('/refresh')
          ) {
            message.error('登录已过期，请重新登录');
            redirectToLogin();
            return;
          }

          // 如果正在刷新token，将请求加入队列
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (error.config && error.config.headers) {
                  error.config.headers['Authorization'] = `Bearer ${token}`;
                }
                return umiRequest(error.config);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          const refreshToken = getRefreshTokenFromStorage();
          if (!refreshToken) {
            console.log('没有refresh token，跳转登录');
            redirectToLogin();
            return;
          }

          isRefreshing = true;

          try {
            // 使用无感刷新函数
            const newToken = await silentRefreshToken();

            if (newToken) {
              // 更新原始请求的authorization header
              if (error.config && error.config.headers) {
                error.config.headers['Authorization'] = `Bearer ${newToken}`;
              }

              // 处理队列中的请求
              processQueue(null, newToken);

              isRefreshing = false;

              // 重新发起原始请求
              return umiRequest(error.config);
            } else {
              // 刷新失败，静默跳转登录
              processQueue(new Error('Token refresh failed'), null);
              isRefreshing = false;
              return;
            }
          } catch (refreshError) {
            console.error('静默刷新token失败:', refreshError);
            processQueue(refreshError, null);
            isRefreshing = false;
            return;
          }
        } catch (e) {
          console.error('处理401错误失败:', e);
          processQueue(e, null);
          isRefreshing = false;
          redirectToLogin();
          return;
        }
      }

      // 其他错误处理
      if (!opts?.skipErrorHandler) {
        // 如果是网络错误或其他非认证错误，才显示错误消息
        if (!isUnauthorized) {
          const errorMessage =
            error?.response?.data?.message || error?.message || '请求发生错误';
          message.error(errorMessage);
        }
      }
      throw error;
    },
  },
};

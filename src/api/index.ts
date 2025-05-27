import type { RequestConfig, RequestOptions } from '@umijs/max';
import { request as umiRequest } from '@umijs/max';
import { message } from 'antd';
import { RefreshToken } from './user'; // 从用户API导入

// 定义基础响应数据接口
export interface baseResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 防止重复刷新token的标志
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

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
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export const request: RequestConfig = {
  requestInterceptors: [
    (config: RequestOptions) => {
      // 从 localStorage 读取 token
      const token = localStorage.getItem('token');
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

      // 只处理401错误
      if (error?.response?.status === 401 && !opts?.skipAuthRefresh) {
        try {
          // 避免死循环：如果当前请求是刷新token接口，直接跳转登录
          if (error?.config?.url?.includes('/refresh')) {
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
                error.config.headers['Authorization'] = `Bearer ${token}`;
                return umiRequest(error.config);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            message.error('登录已过期，请重新登录');
            redirectToLogin();
            return;
          }

          isRefreshing = true;

          // 调用刷新token接口
          const refreshRes = await RefreshToken({
            refresh_token: refreshToken,
          });

          if (refreshRes.code === 0 && refreshRes.data.access_token) {
            // 保存新token
            const newToken = refreshRes.data.access_token;
            localStorage.setItem('token', newToken);

            if (refreshRes.data.refresh_token) {
              localStorage.setItem(
                'refresh_token',
                refreshRes.data.refresh_token,
              );
            }

            // 更新原始请求的authorization header
            error.config.headers['Authorization'] = `Bearer ${newToken}`;

            // 处理队列中的请求
            processQueue(null, newToken);

            isRefreshing = false;

            // 重新发起原始请求
            return umiRequest(error.config);
          } else {
            message.error('登录已过期，请重新登录');
            processQueue(new Error('Token refresh failed'), null);
            redirectToLogin();
            return;
          }
        } catch (e) {
          message.error('登录已过期，请重新登录');
          processQueue(e, null);
          isRefreshing = false;
          redirectToLogin();
          return;
        }
      }

      // 其他错误
      if (!opts?.skipErrorHandler) {
        message.error(error.message || '请求发生错误');
      }
      throw error;
    },
  },
};

/**
 * Token自动刷新定时器
 */
import { RefreshToken } from '@/api/user';
import {
  clearAuthTokens,
  getRefreshTokenFromStorage,
  isTokenExpiringSoon,
} from './auth';

let refreshTimer: NodeJS.Timeout | null = null;

// 启动token刷新定时器
export const startTokenRefreshTimer = () => {
  // 清除旧的定时器
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  // 每5分钟检查一次token状态
  refreshTimer = setInterval(async () => {
    try {
      // 只在有refresh token的情况下检查
      const refreshToken = getRefreshTokenFromStorage();
      if (!refreshToken) {
        return;
      }

      // 检查token是否即将过期
      if (isTokenExpiringSoon()) {
        console.log('定时器检测到token即将过期，开始刷新...');

        try {
          const refreshRes = await RefreshToken({
            refresh_token: refreshToken,
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

            console.log('定时器token刷新成功');
          } else {
            console.warn('定时器token刷新失败，清除认证信息');
            clearAuthTokens();
            stopTokenRefreshTimer();
          }
        } catch (error) {
          console.error('定时器token刷新失败:', error);
          clearAuthTokens();
          stopTokenRefreshTimer();
        }
      }
    } catch (error) {
      console.error('定时器检查token失败:', error);
    }
  }, 5 * 60 * 1000); // 5分钟检查一次

  console.log('Token刷新定时器已启动');
};

// 停止token刷新定时器
export const stopTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
    console.log('Token刷新定时器已停止');
  }
};

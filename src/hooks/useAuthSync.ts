import { getInitialState } from '@/app';
import {
  clearAuthTokens,
  getRefreshTokenFromStorage,
  getTokenFromStorage,
  isTokenExpired,
} from '@/utils/auth';
import { useDispatch, useModel, useSelector } from '@umijs/max';
import { useCallback, useEffect, useState } from 'react';

interface UseAuthSyncReturn {
  isLoggedIn: boolean;
  currentUser: any;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  syncLogoutState: () => Promise<void>;
  checkAndSyncAuthState: () => Promise<void>;
}

/**
 * 用户认证状态同步hook
 */
export const useAuthSync = (): UseAuthSyncReturn => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // 检查并同步认证状态
  const checkAndSyncAuthState = useCallback(async () => {
    const token = getTokenFromStorage();
    const refreshToken = getRefreshTokenFromStorage();

    // 如果没有token或token已过期，清除状态
    if (!token || !refreshToken || isTokenExpired()) {
      if (initialState?.isLoggedIn || user?.isLoggedIn) {
        console.log('Token无效或已过期，同步登出状态');
        clearAuthTokens();

        // 更新initial state
        await setInitialState({
          ...initialState,
          isLoggedIn: false,
          currentUser: null,
          token: null,
          refreshToken: null,
        } as any);

        // 更新user model
        dispatch({ type: 'user/clearUserState' });
      }
      return;
    }

    // 如果有有效token但状态不同步，尝试重新获取状态
    if (
      (!initialState?.isLoggedIn || !user?.isLoggedIn) &&
      token &&
      refreshToken
    ) {
      console.log('检测到有效token但状态未同步，重新初始化');
      setLoading(true);

      try {
        const newState = await getInitialState();
        await setInitialState(newState);

        if (newState.isLoggedIn && newState.currentUser) {
          dispatch({
            type: 'user/setUserState',
            payload: {
              currentUser: newState.currentUser,
              token: newState.token,
              refreshToken: newState.refreshToken,
              isLoggedIn: true,
            },
          });
        }
      } catch (error) {
        console.error('重新初始化认证状态失败:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [initialState, user, setInitialState, dispatch]);

  // 同步登出状态
  const syncLogoutState = useCallback(async () => {
    clearAuthTokens();

    // 更新initial state
    await setInitialState({
      ...initialState,
      isLoggedIn: false,
      currentUser: null,
      token: null,
      refreshToken: null,
    } as any);

    // 停止token刷新定时器
    const { stopTokenRefreshTimer } = await import('@/utils/tokenRefreshTimer');
    stopTokenRefreshTimer();
  }, [initialState, setInitialState]);

  // 定期检查认证状态
  useEffect(() => {
    // 立即检查一次
    checkAndSyncAuthState();

    // 设置定时检查（每分钟检查一次）
    const interval = setInterval(checkAndSyncAuthState, 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAndSyncAuthState]);

  // 监听storage变化，处理多标签页同步
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'refresh_token') {
        console.log('检测到token变化，同步认证状态');
        checkAndSyncAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAndSyncAuthState]);

  return {
    isLoggedIn: initialState?.isLoggedIn || user?.isLoggedIn || false,
    currentUser: initialState?.currentUser || user?.currentUser,
    token: (initialState as any)?.token || user?.token || null,
    refreshToken:
      (initialState as any)?.refreshToken || user?.refreshToken || null,
    loading: loading || user?.loading || false,
    syncLogoutState,
    checkAndSyncAuthState,
  };
};

export default useAuthSync;

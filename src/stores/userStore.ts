import { type UserInfo } from '@/api/user';
import { clearAuthTokens } from '@/utils/auth';
import { create } from 'zustand';

interface UserState {
  currentUser: UserInfo | null;
  isLoggedIn: boolean;
  isInitialized: boolean; // 添加初始化状态
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
  setInitialized: (initialized: boolean) => void; // 设置初始化状态
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  isInitialized: false,
  setUser: (user) => {
    // 确保只有在有有效用户信息时才设置为已登录
    if (user && user.id) {
      set({ currentUser: user, isLoggedIn: true, isInitialized: true });
    } else {
      console.warn('尝试设置无效的用户信息:', user);
      set({ currentUser: null, isLoggedIn: false, isInitialized: true });
    }
  },
  clearUser: () => {
    clearAuthTokens();
    set({ currentUser: null, isLoggedIn: false, isInitialized: true });
  },
  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));

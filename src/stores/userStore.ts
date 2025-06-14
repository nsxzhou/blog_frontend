import { type UserInfo } from '@/api/user';
import { clearAuthTokens } from '@/utils/auth';
import { create } from 'zustand';

interface UserState {
  currentUser: UserInfo | null;
  isLoggedIn: boolean;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  setUser: (user) => set({ currentUser: user, isLoggedIn: true }),
  clearUser: () => {
    clearAuthTokens();
    set({ currentUser: null, isLoggedIn: false });
  },
}));

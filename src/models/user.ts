import { type UserInfo } from '@/api/user';
import { clearAuthTokens } from '@/utils/auth';
import type { Reducer } from '@umijs/max';

export interface UserModelState {
  currentUser: UserInfo | null;
  isLoggedIn: boolean;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  reducers: {
    setUser: Reducer<UserModelState>;
    clearUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: null,
    isLoggedIn: false,
  },
  reducers: {
    setUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload,
        isLoggedIn: true,
      };
    },
    clearUser(state) {
      clearAuthTokens();
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    },
  },
};

export default UserModel;

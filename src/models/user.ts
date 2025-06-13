import {
  GetQQLoginURL,
  GetUserInfo,
  Login,
  Logout,
  QQLoginCallback,
  Register,
  type LoginReq,
  type RegisterReq,
  type UserInfo,
} from '@/api/user';
import {
  clearAuthTokens,
  getTokenFromStorage,
  isTokenExpired,
  setAuthTokens,
} from '@/utils/auth';
import type { Effect, Reducer } from '@umijs/max';

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
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    },
  },
};

export default UserModel;

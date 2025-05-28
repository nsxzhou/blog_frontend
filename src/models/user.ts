import type {
  ChangePasswordReq,
  LoginReq,
  RegisterReq,
  UpdateUserInfoReq,
  UserInfo,
} from '@/api/user';
import {
  ChangePassword,
  GetUserInfo,
  Login,
  Logout,
  Register,
  UpdateUserInfo,
} from '@/api/user';
import { clearAuthTokens, setAuthTokens } from '@/utils/auth';
import { message } from 'antd';

// 用户状态接口
interface UserState {
  currentUser: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
}

// 初始状态
const initialState: UserState = {
  currentUser: null,
  token: null,
  refreshToken: null,
  isLoggedIn: false,
  loading: false,
};

export default {
  namespace: 'user',
  state: initialState,

  effects: {
    // 用户登录
    *login({ payload }: { payload: LoginReq }, { call, put }: any): any {
      yield put({ type: 'setLoading', payload: true });

      try {
        const response: any = yield call(Login, payload);

        if (response.code === 0) {
          const { access_token, refresh_token, user } = response.data;

          setAuthTokens(access_token, refresh_token);

          yield put({
            type: 'setUserState',
            payload: {
              token: access_token,
              refreshToken: refresh_token,
              currentUser: user,
              isLoggedIn: true,
            },
          });

          message.success('登录成功！');
          return { success: true, data: response.data };
        } else {
          message.error(response.message || '登录失败');
          return { success: false, message: response.message };
        }
      } catch (error) {
        message.error('网络连接失败');
        return { success: false, message: '网络错误' };
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // 用户注册
    *register({ payload }: { payload: RegisterReq }, { call, put }: any): any {
      yield put({ type: 'setLoading', payload: true });

      try {
        const response: any = yield call(Register, payload);

        if (response.code === 0) {
          message.success('注册成功！请登录');
          return { success: true };
        } else {
          message.error(response.message || '注册失败');
          return { success: false, message: response.message };
        }
      } catch (error) {
        message.error('网络连接失败');
        return { success: false, message: '网络错误' };
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // 用户登出
    *logout(_: any, { call, put, select }: any): any {
      try {
        const { user }: any = yield select();
        const { token, refreshToken } = user;

        if (token && refreshToken) {
          yield call(Logout, {
            access_token: token,
            refresh_token: refreshToken,
          });
        }
      } catch (error) {
        console.warn('登出API失败:', error);
      } finally {
        yield put({ type: 'clearUserState' });
        message.success('已安全退出');
      }
    },

    // 获取当前用户信息
    *getCurrentUser(_: any, { call, put }: any): any {
      try {
        const response: any = yield call(GetUserInfo);

        if (response.code === 0) {
          yield put({
            type: 'setUserState',
            payload: { currentUser: response.data.user },
          });
          return { success: true, data: response.data.user };
        } else {
          message.error(response.message || '获取用户信息失败');
          return { success: false, message: response.message };
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
        return { success: false, message: '网络错误' };
      }
    },

    // 更新用户信息
    *updateUserInfo(
      { payload }: { payload: UpdateUserInfoReq },
      { call, put }: any,
    ): any {
      yield put({ type: 'setLoading', payload: true });

      try {
        const response: any = yield call(UpdateUserInfo, payload);

        if (response.code === 0) {
          yield put({
            type: 'setUserState',
            payload: { currentUser: response.data.user },
          });
          message.success('用户信息更新成功！');
          return { success: true, data: response.data.user };
        } else {
          message.error(response.message || '更新失败');
          return { success: false, message: response.message };
        }
      } catch (error) {
        message.error('网络连接失败');
        return { success: false, message: '网络错误' };
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // 修改密码
    *changePassword(
      { payload }: { payload: ChangePasswordReq },
      { call }: any,
    ): any {
      try {
        const response: any = yield call(ChangePassword, payload);

        if (response.code === 0) {
          message.success('密码修改成功！');
          return { success: true };
        } else {
          message.error(response.message || '修改密码失败');
          return { success: false, message: response.message };
        }
      } catch (error) {
        message.error('网络连接失败');
        return { success: false, message: '网络错误' };
      }
    },
  },

  reducers: {
    // 设置用户状态
    setUserState(state: UserState, { payload }: any) {
      return { ...state, ...payload };
    },

    // 清除用户状态
    clearUserState() {
      clearAuthTokens();
      return { ...initialState };
    },

    // 设置加载状态
    setLoading(state: UserState, { payload }: any) {
      return { ...state, loading: payload };
    },
  },
};

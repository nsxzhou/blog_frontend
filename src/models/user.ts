import type {
  ChangePasswordReq,
  LoginReq,
  RegisterReq,
  UpdateUserInfoReq,
} from '@/api/user';
import {
  ChangePassword,
  GetQQLoginURL,
  Login,
  Logout,
  QQLoginCallback,
  Register,
  UpdateUserInfo,
} from '@/api/user';
import { clearAuthTokens, setAuthTokens } from '@/utils/auth';
import { Effect, Reducer } from '@umijs/max';
import { message } from 'antd';

export interface UserState {
  currentUser: any;
  isLoggedIn: boolean;
  loading: boolean;
}

export interface UserModelType {
  namespace: 'user';
  state: UserState;
  effects: {
    login: Effect;
    register: Effect;
    logout: Effect;
    updateUserInfo: Effect;
    changePassword: Effect;
    qqLogin: Effect;
    handleQQCallback: Effect;
    initialize: Effect;
  };
  reducers: {
    setCurrentUser: Reducer<UserState>;
    setLoading: Reducer<UserState>;
    setLoggedInStatus: Reducer<UserState>;
    resetUser: Reducer<UserState>;
  };
}

export default {
  namespace: 'user',

  state: {
    currentUser: null,
    isLoggedIn: false,
    loading: false,
  },

  effects: {
    *login(
      { payload }: { payload: LoginReq },
      { call, put }: { call: any; put: any },
    ): Generator<any, any, any> {
      yield put({ type: 'setLoading', payload: true });

      try {
        const response = yield call(Login, payload);

        if (response.code === 0) {
          const { access_token, refresh_token, user, expires_in } =
            response.data;

          // 保存token到localStorage
          setAuthTokens(access_token, refresh_token, expires_in);

          // 更新状态
          yield put({
            type: 'setCurrentUser',
            payload: user,
          });

          yield put({
            type: 'setLoggedInStatus',
            payload: true,
          });

          console.log('用户登录成功，开始初始化WebSocket连接...');

          // 确定WebSocket URL
          let wsUrl = 'ws://localhost:8080/api/ws/connect';
          if (window.location.protocol === 'https:') {
            wsUrl = 'wss://localhost:8080/api/ws/connect';
          }

          // 初始化WebSocket连接
          yield put({
            type: 'websocket/connect',
            payload: {
              url: wsUrl,
              options: {
                maxReconnectAttempts: 5,
                reconnectInterval: 3000,
              },
            },
          });

          console.log('WebSocket连接初始化请求已发送');

          // 确保通知模型能监听到WebSocket状态
          yield put({ type: 'notification/connectWebSocket' });

          console.log('登录流程完成，通知模块将通过websocket模型获取连接状态');

          message.success('登录成功！');
          return { success: true, data: response.data };
        } else {
          console.log('login error', response);
          message.error(response.message || '登录失败');
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        console.log('login error', error);
        // 处理登录错误
        const errorMessage = error?.response?.data?.message || error?.message;
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *register(
      { payload }: { payload: RegisterReq },
      { call, put }: { call: any; put: any },
    ): Generator<any, any, any> {
      yield put({ type: 'setLoading', payload: true });

      try {
        const response = yield call(Register, payload);

        if (response.code === 0) {
          message.success('注册成功！请登录');
          return { success: true };
        } else {
          message.error(response.message || '注册失败');
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        // 处理注册错误
        const errorMessage =
          error?.response?.data?.message || error?.message || '注册失败';
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *logout(
      _: any,
      { call, put }: { call: any; put: any },
    ): Generator<any, void, any> {
      yield put({ type: 'setLoading', payload: true });

      try {
        // 尝试调用登出API（忽略错误）
        yield call(Logout, {
          access_token: localStorage.getItem('token') || '',
          refresh_token: localStorage.getItem('refresh_token') || '',
        }).catch(() => {
          // 忽略登出API错误，继续执行本地清理
        });
      } finally {
        // 清除本地token
        clearAuthTokens();

        // 更新状态
        yield put({ type: 'resetUser' });

        // 更新通知模型的连接状态
        yield put({
          type: 'notification/updateConnectionStatus',
          payload: { isConnected: false, status: '未连接' },
        });

        yield put({ type: 'setLoading', payload: false });

        message.success('已安全退出');
      }
    },

    *updateUserInfo(
      { payload }: { payload: UpdateUserInfoReq },
      { call, put }: { call: any; put: any },
    ): Generator<any, any, any> {
      yield put({ type: 'setLoading', payload: true });

      try {
        const response = yield call(UpdateUserInfo, payload);

        if (response.code === 0) {
          // 更新状态
          yield put({
            type: 'setCurrentUser',
            payload: response.data.user,
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

    *changePassword(
      { payload }: { payload: ChangePasswordReq },
      { call, put }: { call: any; put: any },
    ): Generator<any, any, any> {
      yield put({ type: 'setLoading', payload: true });

      try {
        const response = yield call(ChangePassword, payload);

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
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *qqLogin(
      _: any,
      { call, put }: { call: any; put: any },
    ): Generator<any, any, any> {
      yield put({ type: 'setLoading', payload: true });

      try {
        const response = yield call(GetQQLoginURL);

        if (response.code === 0) {
          // 跳转到QQ登录页面
          window.location.href = response.data.url;
          return { success: true, data: response.data.url };
        } else {
          message.error(response.message || '获取QQ登录链接失败');
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          '获取QQ登录链接失败';
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *handleQQCallback(
      { payload }: { payload: { code: string } },
      { call, put }: { call: any; put: any },
    ): Generator<any, any, any> {
      yield put({ type: 'setLoading', payload: true });

      try {
        const code =
          payload?.code ||
          new URLSearchParams(window.location.search).get('code');

        if (!code) {
          message.error('QQ登录授权码缺失');
          return { success: false, message: 'QQ登录授权码缺失' };
        }

        const response = yield call(QQLoginCallback, { code });

        if (response.code === 0) {
          const { access_token, refresh_token, user, expires_in } =
            response.data;

          // 保存token到localStorage
          setAuthTokens(access_token, refresh_token, expires_in);

          // 更新状态
          yield put({
            type: 'setCurrentUser',
            payload: user,
          });

          yield put({
            type: 'setLoggedInStatus',
            payload: true,
          });

          // 确定WebSocket URL
          let wsUrl = 'ws://localhost:8080/api/ws/connect';
          if (window.location.protocol === 'https:') {
            wsUrl = 'wss://localhost:8080/api/ws/connect';
          }

          // 初始化WebSocket连接
          yield put({
            type: 'websocket/connect',
            payload: {
              url: wsUrl,
              options: {
                maxReconnectAttempts: 5,
                reconnectInterval: 3000,
              },
            },
          });

          message.success('QQ登录成功！');
          return { success: true, data: response.data };
        } else {
          message.error(response.message || 'QQ登录失败');
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'QQ登录失败';
        message.error(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },

  reducers: {
    setCurrentUser(state: UserState, { payload }: { payload: any }) {
      localStorage.setItem('currentUser', JSON.stringify(payload));

      return {
        ...state,
        currentUser: payload,
      };
    },

    setLoading(state: UserState, { payload }: { payload: boolean }) {
      return {
        ...state,
        loading: payload,
      };
    },

    setLoggedInStatus(state: UserState, { payload }: { payload: boolean }) {
      return {
        ...state,
        isLoggedIn: payload,
      };
    },

    resetUser(state: UserState) {
      // 清除 localStorage 中的用户信息
      localStorage.removeItem('currentUser');

      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    },
  },
};

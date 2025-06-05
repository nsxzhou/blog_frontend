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
import { useModel } from '@umijs/max';
import { message } from 'antd';

interface UserModelReturn {
  currentUser: any;
  isLoggedIn: boolean;
  login: (
    payload: LoginReq,
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  register: (
    payload: RegisterReq,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUserInfo: (
    payload: UpdateUserInfoReq,
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  changePassword: (
    payload: ChangePasswordReq,
  ) => Promise<{ success: boolean; message?: string }>;
  qqLogin: () => Promise<{ success: boolean; data?: any; message?: string }>;
  handleQQCallback: () => Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }>;
}

export default function useUserModel(): UserModelReturn {
  const { initialState, setInitialState } = useModel('@@initialState');

  // 用户登录
  const login = async (payload: LoginReq) => {
    try {
      const response = await Login(payload);

      if (response.code === 0) {
        const { access_token, refresh_token, user, expires_at } = response.data;

        // 保存token到localStorage
        setAuthTokens(access_token, refresh_token, expires_at);

        // 更新全局状态
        setInitialState((prev: any) => ({
          ...prev,
          currentUser: user,
          isLoggedIn: true,
        }));

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
    }
  };

  // 用户注册
  const register = async (payload: RegisterReq) => {
    try {
      const response = await Register(payload);

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
    }
  };

  // 用户登出
  const logout = async () => {
    try {
      // 尝试调用登出API（忽略错误）
      await Logout({
        access_token: localStorage.getItem('token') || '',
        refresh_token: localStorage.getItem('refresh_token') || '',
      }).catch(() => {
        // 忽略登出API错误，继续执行本地清理
      });
    } finally {
      // 清除本地token
      clearAuthTokens();

      // 更新全局状态
      setInitialState((prev: any) => ({
        ...prev,
        currentUser: null,
        isLoggedIn: false,
      }));

      message.success('已安全退出');
    }
  };

  // 更新用户信息
  const updateUserInfo = async (payload: UpdateUserInfoReq) => {
    try {
      const response = await UpdateUserInfo(payload);

      if (response.code === 0) {
        // 更新全局状态
        setInitialState((prev: any) => ({
          ...prev,
          currentUser: response.data.user,
        }));

        message.success('用户信息更新成功！');
        return { success: true, data: response.data.user };
      } else {
        message.error(response.message || '更新失败');
        return { success: false, message: response.message };
      }
    } catch (error) {
      message.error('网络连接失败');
      return { success: false, message: '网络错误' };
    }
  };

  // 修改密码
  const changePassword = async (payload: ChangePasswordReq) => {
    try {
      const response = await ChangePassword(payload);

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
  };

  // QQ登录
  const qqLogin = async () => {
    try {
      const response = await GetQQLoginURL();
      if (response.code === 0) {
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
    }
  };

  // 处理QQ登录回调
  const handleQQCallback = async () => {
    try {
      // 从URL中获取code参数
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        message.error('QQ登录授权码缺失');
        return { success: false, message: 'QQ登录授权码缺失' };
      }

      const response = await QQLoginCallback(code);

      if (response.code === 0) {
        const { access_token, refresh_token, user, expires_in } = response.data;

        // 保存token到localStorage
        setAuthTokens(access_token, refresh_token, expires_in);

        // 更新全局状态
        setInitialState((prev: any) => ({
          ...prev,
          currentUser: user,
          isLoggedIn: true,
        }));

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
    }
  };

  return {
    // 状态
    currentUser: initialState?.currentUser,
    isLoggedIn: initialState?.isLoggedIn || false,

    // 方法
    login,
    register,
    logout,
    updateUserInfo,
    changePassword,
    qqLogin,
    handleQQCallback,
  };
}

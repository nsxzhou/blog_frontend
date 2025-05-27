import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  ChangePasswordReq,
  ChangePasswordRes,
  GetUserInfoRes,
  LoginReq,
  LoginRes,
  LogoutReq,
  LogoutRes,
  RefreshTokenReq,
  RefreshTokenRes,
  RegisterReq,
  RegisterRes,
  UpdateUserInfoReq,
  UpdateUserInfoRes,
} from './type';

// 用户注册
export function Register(data: RegisterReq) {
  return request<baseResponse<RegisterRes>>('/api/users/register', {
    method: 'POST',
    data,
  });
}

// 用户登录
export function Login(data: LoginReq) {
  return request<baseResponse<LoginRes>>('/api/users/login', {
    method: 'POST',
    data,
  });
}

// 刷新令牌
export function RefreshToken(data: RefreshTokenReq) {
  return request<baseResponse<RefreshTokenRes>>('/api/users/refresh', {
    method: 'POST',
    data,
    headers: {
      Authorization: `Bearer ${data.refresh_token}`,
    },
  });
}

// 用户登出
export function Logout(data: LogoutReq) {
  return request<baseResponse<LogoutRes>>('/api/users/logout', {
    method: 'POST',
    data,
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });
}

// 获取用户信息
export function GetUserInfo(options?: {
  silent?: boolean;
  skipAuthRefresh?: boolean;
}) {
  return request<baseResponse<GetUserInfoRes>>('/api/users/me', {
    method: 'GET',
    skipErrorHandler: options?.silent,
    skipAuthRefresh: options?.skipAuthRefresh,
  });
}

// 更新用户信息
export function UpdateUserInfo(data: UpdateUserInfoReq) {
  return request<baseResponse<UpdateUserInfoRes>>('/api/users/me', {
    method: 'PUT',
    data,
  });
}

// 更新用户密码
export function ChangePassword(data: ChangePasswordReq) {
  return request<baseResponse<ChangePasswordRes>>(
    '/api/users/change-password',
    {
      method: 'POST',
      data,
    },
  );
}

// 统一导出用户相关的API和类型
export * from './type';

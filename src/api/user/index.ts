import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  BatchActionUsersReq,
  ChangePasswordReq,
  GetFollowersReq,
  GetFollowersRes,
  GetFollowingReq,
  GetFollowingRes,
  GetUserByIdRes,
  GetUserInfoRes,
  GetUsersReq,
  GetUsersRes,
  GetUserStatsRes,
  LoginReq,
  LoginRes,
  LogoutReq,
  QQLoginRes,
  RefreshTokenReq,
  RefreshTokenRes,
  RegisterReq,
  UpdateUserInfoReq,
  UpdateUserInfoRes,
} from './type';

// 用户注册
export function Register(data: RegisterReq) {
  return request<baseResponse<any>>('/api/users/register', {
    method: 'POST',
    data,
    skipErrorHandler: true, // 跳过错误处理器，注册失败不应该尝试刷新token
  });
}

// 用户登录
export function Login(data: LoginReq) {
  return request<baseResponse<LoginRes>>('/api/users/login', {
    method: 'POST',
    data,
    skipErrorHandler: true, // 跳过错误处理器，登录失败不应该尝试刷新token
  });
}

// 刷新令牌
export function RefreshToken(data: RefreshTokenReq) {
  return request<baseResponse<RefreshTokenRes>>('/api/users/refresh', {
    method: 'POST',
    data,
  });
}

// 用户登出
export function Logout(data: LogoutReq) {
  return request<baseResponse<any>>('/api/users/logout', {
    method: 'POST',
    data,
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
  return request<baseResponse<any>>('/api/users/change-password', {
    method: 'POST',
    data,
  });
}

// 获取指定用户信息
export function GetUserById(id: number) {
  return request<baseResponse<GetUserByIdRes>>(`/api/users/${id}`, {
    method: 'GET',
  });
}

// 关注用户
export function FollowUser(id: number) {
  return request<baseResponse<any>>(`/api/users/follow/${id}`, {
    method: 'POST',
  });
}

// 取消关注用户
export function UnfollowUser(id: number) {
  return request<baseResponse<any>>(`/api/users/follow/${id}`, {
    method: 'DELETE',
  });
}

// 获取当前用户粉丝列表
export function GetFollowers(params?: GetFollowersReq) {
  return request<baseResponse<GetFollowersRes>>('/api/users/followers', {
    method: 'GET',
    params,
  });
}

// 获取当前用户关注列表
export function GetFollowing(params?: GetFollowingReq) {
  return request<baseResponse<GetFollowingRes>>('/api/users/following', {
    method: 'GET',
    params,
  });
}

// 获取用户列表
export function GetUsers(params?: GetUsersReq) {
  return request<baseResponse<GetUsersRes>>('/api/users', {
    method: 'GET',
    params,
  });
}

// 更新用户状态
export function UpdateUserStatus(id: number, data: { status: number }) {
  return request<baseResponse<any>>(`/api/users/${id}/status`, {
    method: 'PUT',
    data,
  });
}

// 获取用户统计
export function GetUserStats() {
  return request<baseResponse<GetUserStatsRes>>('/api/users/stats', {
    method: 'GET',
  });
}

// 重置用户密码
export function ResetUserPassword(id: number, data: { new_password: string }) {
  return request<baseResponse<any>>(`/api/users/${id}/reset-password`, {
    method: 'POST',
    data,
  });
}

// 批量操作用户
export function BatchActionUsers(data: BatchActionUsersReq) {
  return request<baseResponse<any>>('/api/users/batch-action', {
    method: 'POST',
    data,
  });
}

// 获取QQ登录URL
export function GetQQLoginURL() {
  return request<baseResponse<{ url: string }>>('/api/users/qq/login-url', {
    method: 'GET',
  });
}

// 获取QQ登录回调
export function QQLoginCallback(params: { code: string }) {
  return request<baseResponse<QQLoginRes>>('/api/users/qq/callback', {
    method: 'GET',
    params,
  });
}

// 统一导出用户相关的API和类型
export * from './type';

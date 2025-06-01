// 注册请求参数
export interface RegisterReq {
  email: string;
  nickname: string;
  password: string;
  username: string;
}

// 登录请求参数
export interface LoginReq {
  password: string;
  remember?: boolean;
  username: string;
}

// 登录响应数据
export interface LoginRes {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: UserInfo;
}

// 刷新令牌请求参数
export interface RefreshTokenReq {
  refresh_token: string;
}

// 刷新令牌响应数据
export interface RefreshTokenRes {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// 登出请求参数
export interface LogoutReq {
  access_token: string;
  refresh_token: string;
}

// 用户信息接口
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: string;
  status?: number; // 0: 禁用, 1: 启用
  created_at: string;
  updated_at: string;
  followers_count?: number; // 粉丝数
  following_count?: number; // 关注数
  articles_count?: number; // 文章数
  is_following?: boolean; // 是否已关注该用户
}

// 获取用户信息响应数据
export interface GetUserInfoRes {
  user: UserInfo;
}

// 更新用户信息请求参数
export interface UpdateUserInfoReq {
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

// 更新用户信息响应数据
export interface UpdateUserInfoRes {
  user: UserInfo;
}

// 更新密码请求参数
export interface ChangePasswordReq {
  old_password: string;
  new_password: string;
}

// 获取指定用户信息请求参数
export interface GetUserByIdReq {
  id: number;
}

// 获取指定用户信息响应数据
export interface GetUserByIdRes {
  user: UserInfo;
}

// 关注用户请求参数
export interface FollowUserReq {
  id: number;
}

// 取消关注用户请求参数
export interface UnfollowUserReq {
  id: number;
}

// 获取关注者列表请求参数
export interface GetFollowersReq {
  page?: number;
  page_size?: number;
}

// 获取关注者列表响应数据
export interface GetFollowersRes {
  list: UserInfo[];
  total: number;
}

// 获取关注列表请求参数
export interface GetFollowingReq {
  page?: number;
  page_size?: number;
}

// 获取关注列表响应数据
export interface GetFollowingRes {
  list: UserInfo[];
  total: number;
}

// 获取用户列表请求参数
export interface GetUsersReq {
  page?: number;
  page_size?: number;
  keyword?: string;
  role?: string;
  status?: number;
  order_by?: string;
  order?: 'asc' | 'desc';
}

// 获取用户列表响应数据
export interface GetUsersRes {
  list: UserInfo[];
  total: number;
}

// 更新用户状态请求参数
export interface UpdateUserStatusReq {
  id: number;
  status: number; // 0: 禁用, 1: 启用
}

// 获取用户统计响应数据
export interface GetUserStatsRes {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_users: number;
  regular_users: number;
}

// 重置用户密码请求参数
export interface ResetUserPasswordReq {
  id: number;
  new_password: string;
}

// 批量操作用户请求参数
export interface BatchActionUsersReq {
  action: 'enable' | 'disable' | 'delete';
  user_ids: number[];
}

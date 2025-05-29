// 注册请求参数
export interface RegisterReq {
    email: string;
    nickname: string;
    password: string;
    username: string;
}

// 注册响应数据
export interface RegisterRes {
    success: boolean;
    message?: string;
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

// 登出响应数据
export interface LogoutRes {
    success: boolean;
    message?: string;
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
    created_at: string;
    updated_at: string;
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

// 更新密码响应数据
export interface ChangePasswordRes {
    success: boolean;
    message?: string;
}

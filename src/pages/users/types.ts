// 筛选参数类型 - 精确匹配接口参数
export interface FilterParams {
  keyword: string;
  role: 'admin' | 'user' | ''; // 精确匹配接口要求
  status: 0 | 1 | 2; // 0: 禁用, 1: 启用, 2: 全部
}

// 排序参数类型 - 精确匹配接口参数
export interface SortParams {
  order_by: 'created_at' | 'last_login_at'; // 只支持这两个字段
  order: 'asc' | 'desc';
}

// 用户状态配置
export interface StatusConfig {
  color: string;
  bgColor: string;
  text: string;
}

// 角色配置
export interface RoleConfig {
  color: string;
  bgColor: string;
  text: string;
  priority: number;
}

// 用户操作类型
export type UserAction = 'enable' | 'disable' | 'delete' | 'resetPassword';

// 批量操作参数
export interface BatchActionParams {
  action: UserAction;
  userIds: number[];
  newPassword?: string;
}

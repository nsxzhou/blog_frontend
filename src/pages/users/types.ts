// 筛选参数类型
export interface FilterParams {
  keyword: string;
  role: string;
  status: number | undefined;
}

// 排序参数类型
export interface SortParams {
  order_by: string;
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

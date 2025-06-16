import type { UserInfo } from '@/api/user';

// 权限枚举
export enum RoutePermission {
  PUBLIC = 'public', // 公开页面，无需登录
  AUTH_REQUIRED = 'auth', // 需要登录
  ADMIN_ONLY = 'admin', // 仅管理员
  GUEST_ONLY = 'guest', // 仅未登录用户（如登录页）
}

// 路由配置接口
export interface RouteConfig {
  permission: RoutePermission;
  redirectTo?: string; // 自定义重定向路径
  customCheck?: (user: UserInfo | null, isLoggedIn: boolean) => boolean;
}

// 权限检查结果
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
  redirectTo?: string;
  shouldRedirect: boolean;
}

// 路由权限配置映射
export const routeConfigMap: Record<string, RouteConfig> = {
  // 公开页面
  '/': { permission: RoutePermission.PUBLIC },
  '/blog': { permission: RoutePermission.PUBLIC },
  '/about': { permission: RoutePermission.PUBLIC },
  '/article-detail': { permission: RoutePermission.PUBLIC }, // 支持动态路由
  '/403': { permission: RoutePermission.PUBLIC },

  // 仅未登录用户可访问
  '/login': { permission: RoutePermission.GUEST_ONLY },
  '/qq/callback': { permission: RoutePermission.GUEST_ONLY },

  // 需要登录的页面
  '/profile': { permission: RoutePermission.AUTH_REQUIRED },
  '/notifications': { permission: RoutePermission.AUTH_REQUIRED },
  '/reading-history': { permission: RoutePermission.AUTH_REQUIRED },
  '/favorites': { permission: RoutePermission.AUTH_REQUIRED },

  // 管理员专用页面
  '/categories': { permission: RoutePermission.ADMIN_ONLY },
  '/tags': { permission: RoutePermission.ADMIN_ONLY },
  '/images': { permission: RoutePermission.ADMIN_ONLY },
  '/comments': { permission: RoutePermission.ADMIN_ONLY },
  '/users': { permission: RoutePermission.ADMIN_ONLY },
  '/write': { permission: RoutePermission.ADMIN_ONLY },
  '/articles': { permission: RoutePermission.ADMIN_ONLY },
  '/my-articles': { permission: RoutePermission.ADMIN_ONLY },
};

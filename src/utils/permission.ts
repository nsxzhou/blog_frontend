import type { UserInfo } from '@/api/user';
import { RoutePermission, type PermissionCheckResult } from './routeAccess';

/**
 * 权限检查工具类
 * 提供统一的权限检查逻辑
 */
export class PermissionChecker {
  /**
   * 检查用户是否为管理员
   */
  static isAdmin(user: UserInfo | null): boolean {
    return user?.role === 'admin';
  }

  /**
   * 检查用户是否具有特定角色
   */
  static hasRole(user: UserInfo | null, role: string): boolean {
    return user?.role === role;
  }

  /**
   * 检查用户状态是否有效
   */
  static isUserActive(user: UserInfo | null): boolean {
    return user?.status === 1; // 1: 启用, 0: 禁用
  }

  /**
   * 检查权限
   */
  static checkPermission(
    permission: RoutePermission,
    user: UserInfo | null,
    isLoggedIn: boolean,
    customRedirectTo?: string,
  ): PermissionCheckResult {
    const defaultRedirectTo = customRedirectTo || '/login';

    switch (permission) {
      case RoutePermission.PUBLIC:
        // 公开页面，所有人都可以访问
        return {
          hasPermission: true,
          shouldRedirect: false,
        };

      case RoutePermission.GUEST_ONLY:
        // 仅未登录用户可访问（如登录页）
        if (isLoggedIn) {
          return {
            hasPermission: false,
            reason: '您已登录，无需访问此页面',
            redirectTo: '/',
            shouldRedirect: true,
          };
        }
        return {
          hasPermission: true,
          shouldRedirect: false,
        };

      case RoutePermission.AUTH_REQUIRED:
        // 需要登录
        if (!isLoggedIn) {
          return {
            hasPermission: false,
            reason: '请先登录',
            redirectTo: defaultRedirectTo,
            shouldRedirect: true,
          };
        }

        // 检查用户状态
        if (!this.isUserActive(user)) {
          return {
            hasPermission: false,
            reason: '您的账户已被禁用',
            redirectTo: '/403',
            shouldRedirect: true,
          };
        }

        return {
          hasPermission: true,
          shouldRedirect: false,
        };

      case RoutePermission.ADMIN_ONLY:
        // 仅管理员可访问
        if (!isLoggedIn) {
          return {
            hasPermission: false,
            reason: '请先登录',
            redirectTo: defaultRedirectTo,
            shouldRedirect: true,
          };
        }

        if (!this.isAdmin(user)) {
          return {
            hasPermission: false,
            reason: '您没有权限访问此页面',
            redirectTo: '/403',
            shouldRedirect: true,
          };
        }

        // 检查用户状态
        if (!this.isUserActive(user)) {
          return {
            hasPermission: false,
            reason: '您的账户已被禁用',
            redirectTo: '/403',
            shouldRedirect: true,
          };
        }

        return {
          hasPermission: true,
          shouldRedirect: false,
        };

      default:
        // 未知权限类型，默认拒绝访问
        return {
          hasPermission: false,
          reason: '未知的权限类型',
          redirectTo: '/403',
          shouldRedirect: true,
        };
    }
  }

  /**
   * 检查自定义权限
   */
  static checkCustomPermission(
    customCheck: (user: UserInfo | null, isLoggedIn: boolean) => boolean,
    user: UserInfo | null,
    isLoggedIn: boolean,
    customRedirectTo?: string,
  ): PermissionCheckResult {
    const hasPermission = customCheck(user, isLoggedIn);

    if (hasPermission) {
      return {
        hasPermission: true,
        shouldRedirect: false,
      };
    }

    return {
      hasPermission: false,
      reason: '自定义权限检查失败',
      redirectTo: customRedirectTo || '/403',
      shouldRedirect: true,
    };
  }
}

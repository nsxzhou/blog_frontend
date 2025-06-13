import { UserInfo } from '@/api/user';
import { UserModelState } from '@/models/user';
import { connect, history } from '@umijs/max';
import { Button, Result } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // 需要的角色
  customCheck?: (user: any) => boolean; // 自定义检查函数
  fallback?: React.ReactNode; // 自定义无权限页面
  redirectTo?: string; // 无权限时跳转路径
  currentUser: UserInfo | null;
  isLoggedIn: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  customCheck,
  fallback,
  redirectTo = '/login',
  currentUser,
  isLoggedIn,
}) => {
  // 权限判断逻辑
  const checkPermission = () => {
    // 如果没有权限要求，直接放行
    if (!requiredRole) return true;

    // 特殊页面：只有未登录用户可以访问（如登录页）
    if (requiredRole === 'shouldNotAccess') {
      return !isLoggedIn;
    }

    // 需要登录的页面
    if (requiredRole === 'canAccess' || requiredRole === 'isAdmin') {
      // 如果页面需要登录但用户未登录，返回 false
      if (!isLoggedIn) return false;

      // 如果是管理员页面，检查角色
      if (requiredRole === 'isAdmin') {
        return currentUser?.role === 'admin';
      }

      // 普通需要登录的页面，已登录即可访问
      return true;
    }

    // 其他情况默认不允许访问
    return false;
  };

  const hasPermission = customCheck
    ? customCheck({ currentUser, isLoggedIn })
    : checkPermission();

  // 只有在需要登录的页面且未登录时才重定向
  const shouldRedirect =
    !hasPermission && requiredRole && requiredRole !== 'shouldNotAccess';

  useEffect(() => {
    if (shouldRedirect && redirectTo && !fallback) {
      const currentPath = window.location.pathname;
      history.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [shouldRedirect, redirectTo, fallback]);

  if (!hasPermission) {
    if (shouldRedirect && redirectTo && !fallback) {
      return null;
    }
    if (fallback) {
      return <>{fallback}</>;
    }
    // 已登录但权限不足，显示 403
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面"
          extra={
            <div className="space-x-4">
              <Button
                type="primary"
                onClick={() => {
                  const currentPath = window.location.pathname;
                  history.push(
                    `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`,
                  );
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                去登录
              </Button>
              <Button onClick={() => history.push('/')}>返回首页</Button>
            </div>
          }
        />
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default connect(({ user }: { user: UserModelState }) => ({
  currentUser: user.currentUser,
  isLoggedIn: user.isLoggedIn,
}))(ProtectedRoute);

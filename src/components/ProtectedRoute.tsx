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
    if (!requiredRole) return true; // 没有权限要求，直接放行
    if (requiredRole === 'shouldNotAccess') {
      return !isLoggedIn; // 只有未登录用户可以访问
    }
    if (!isLoggedIn) return false; // 其它有权限要求的页面，未登录直接拦截
    switch (requiredRole) {
      case 'isAdmin':
        return currentUser?.role === 'admin';
      case 'canAccess':
        return true;
      default:
        return false;
    }
  };

  const hasPermission = customCheck
    ? customCheck({ currentUser, isLoggedIn })
    : checkPermission();

  const isNoLogin = !isLoggedIn && requiredRole !== 'shouldNotAccess';

  useEffect(() => {
    if (!hasPermission && isNoLogin && redirectTo && !fallback) {
      history.push(redirectTo);
    }
  }, [hasPermission, redirectTo, fallback, isNoLogin]);

  if (!hasPermission) {
    if (isNoLogin && redirectTo && !fallback) {
      // 跳转时不渲染内容
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
                onClick={() => history.push('/login')}
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

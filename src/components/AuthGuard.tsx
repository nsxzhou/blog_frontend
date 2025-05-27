import { history, useModel } from '@umijs/max';
import { Spin } from 'antd';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

const AuthGuard: FC<AuthGuardProps> = ({ children, redirectTo = '/login' }) => {
  const { initialState, loading } = useModel('@@initialState');
  const { isLoggedIn, currentUser } = initialState || {};

  useEffect(() => {
    // 如果不在加载状态且用户未登录，则重定向到登录页
    if (!loading && !isLoggedIn) {
      history.push(redirectTo);
    }
  }, [loading, isLoggedIn, redirectTo]);

  // 正在加载初始状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // 用户未登录，返回空内容（会被重定向）
  if (!isLoggedIn || !currentUser) {
    return null;
  }

  // 用户已登录，渲染子组件
  return <>{children}</>;
};

export default AuthGuard;

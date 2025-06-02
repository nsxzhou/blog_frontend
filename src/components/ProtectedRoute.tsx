import { history, useAccess, useModel } from '@umijs/max';
import { Button, Result } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  access?: string; // 权限key
  fallback?: React.ReactNode; // 自定义无权限页面
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  access,
  fallback,
}) => {
  const accessMap = useAccess();

  // 如果没有指定权限要求，直接渲染
  if (!access) {
    return <>{children}</>;
  }

  // 检查权限
  const hasPermission = accessMap[access as keyof typeof accessMap];

  if (!hasPermission) {
    // 如果有自定义fallback，使用它
    if (fallback) {
      return <>{fallback}</>;
    }

    // 默认的403页面
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

export default ProtectedRoute;

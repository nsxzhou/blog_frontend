import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import { motion } from 'framer-motion';
import type { FC } from 'react';

const UnauthorizedPage: FC = () => {
  const handleGoToLogin = () => {
    history.push('/login');
  };

  const handleGoHome = () => {
    history.push('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="max-w-md w-full mx-4">
        <Result
          status="403"
          title="访问受限"
          subTitle="抱歉，您需要登录后才能访问此页面。"
          extra={
            <div className="space-x-4">
              <Button type="primary" onClick={handleGoToLogin}>
                立即登录
              </Button>
              <Button onClick={handleGoHome}>返回首页</Button>
            </div>
          }
        />
      </div>
    </motion.div>
  );
};

export default UnauthorizedPage;

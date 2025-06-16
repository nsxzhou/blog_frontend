import { delayedEntry, hoverScaleSmall } from '@/constants/animations';
import { useNavigate, useSearchParams } from '@umijs/max';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { LoginForm, RegisterForm } from './components';
import { message } from 'antd';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  // 验证重定向路径的安全性
  const validateRedirectPath = (path: string): boolean => {
    // 检查是否是相对路径或者是否是当前域名下的路径
    if (!path) return false;

    try {
      // 尝试解码路径
      const decodedPath = decodeURIComponent(path);

      // 检查是否包含潜在的危险字符
      if (
        decodedPath.includes('javascript:') ||
        decodedPath.includes('data:') ||
        decodedPath.includes('//') ||
        !decodedPath.startsWith('/')
      ) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleAuthSuccess = () => {
    if (redirectPath) {
      // 验证重定向路径
      if (validateRedirectPath(redirectPath)) {
        try {
          const decodedPath = decodeURIComponent(redirectPath);
          navigate(decodedPath);
        } catch (error) {
          console.error('重定向路径解析错误:', error);
          message.error('重定向失败，将返回首页');
          navigate('/');
        }
      } else {
        console.warn('检测到不安全的重定向路径:', redirectPath);
        message.warning('检测到不安全的重定向地址，将返回首页');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
  };

  // 检查当前页面是否是通过重定向到达的
  useEffect(() => {
    if (redirectPath) {
      message.info('请先登录后继续访问');
    }
  }, [redirectPath]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* 简化的背景装饰 - 减少动画元素提升性能 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl" />
        <motion.div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-100 rounded-full opacity-25 blur-3xl" />
      </div>

      {/* 主容器 */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md relative z-10"
      >
        {/* 卡片容器 */}
        <motion.div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-white/30">
          {/* 头部标题 */}
          <motion.div className="text-center mb-8">
            <motion.div key={isLogin ? 'login-title' : 'register-title'}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? '欢迎回来' : '加入我们'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? '登录到您的账户' : '创建您的新账户'}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isLogin ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={handleSwitchMode}
              />
            ) : (
              <RegisterForm
                onSuccess={() => setIsLogin(true)}
                onSwitchToLogin={handleSwitchMode}
              />
            )}
          </motion.div>
        </motion.div>

        {/* 底部装饰 - 简化动画 */}
        <motion.div
          className="text-center mt-6 text-sm text-gray-500"
          {...delayedEntry}
        >
          继续使用即表示您同意我们的
          <motion.span
            className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors mx-1"
            {...hoverScaleSmall}
          >
            服务条款
          </motion.span>
          和
          <motion.span
            className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors ml-1"
            {...hoverScaleSmall}
          >
            隐私政策
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

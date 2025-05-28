import {
  containerVariants,
  delayedEntry,
  fadeInDown,
  fadeInUp,
  floatingAnimation,
  hoverScaleSmall,
  scaleIn,
} from '@/constants/animations';
import { useNavigate } from '@umijs/max';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { LoginForm, RegisterForm } from './components';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const handleAuthSuccess = () => {
    navigate('/');
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* 简化的背景装饰 - 减少动画元素提升性能 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"
          {...floatingAnimation}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-100 rounded-full opacity-25 blur-3xl"
          {...floatingAnimation}
        />
      </div>

      {/* 主容器 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md relative z-10"
      >
        {/* 卡片容器 */}
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30"
          {...scaleIn}
        >
          {/* 头部标题 */}
          <motion.div className="text-center mb-8" {...fadeInDown}>
            <motion.div
              key={isLogin ? 'login-title' : 'register-title'}
              {...fadeInUp}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? '欢迎回来' : '加入我们'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? '登录到您的账户' : '创建您的新账户'}
              </p>
            </motion.div>
          </motion.div>

          {/* 表单区域 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              variants={containerVariants}
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
          </AnimatePresence>
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

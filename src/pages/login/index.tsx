import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { history } from '@umijs/max';
import { LoginForm, RegisterForm } from './components';

// 优化的页面动画变体 - 更轻量级，减少性能消耗
const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

// 表单切换动画 - 更快速的切换
const formVariants = {
  hidden: { 
    opacity: 0, 
    x: 10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { 
      duration: 0.1, 
      ease: "easeOut" 
    }
  },
  exit: {
    opacity: 0,
    x: -10,
    scale: 0.95,
    transition: { 
      duration: 0.1,
      ease: "easeIn"
    }
  }
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const handleAuthSuccess = () => {
    // 使用更流畅的页面跳转
    history.push('/');
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
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-100 rounded-full opacity-25 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* 主容器 */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md relative z-10"
      >
        {/* 卡片容器 */}
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30"
          whileHover={{ 
            y: -4, 
            boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)" 
          }}
          transition={{ duration: 0.2 }}
        >
          {/* 头部标题 */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <motion.div
              key={isLogin ? 'login-title' : 'register-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
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
              variants={formVariants}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          继续使用即表示您同意我们的
          <motion.span 
            className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors mx-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            服务条款
          </motion.span>
          和
          <motion.span 
            className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors ml-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            隐私政策
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
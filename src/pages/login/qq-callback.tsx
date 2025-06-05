import { fadeInUp } from '@/constants/animations';
import useUserModel from '@/models/user';
import { history } from '@umijs/max';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const QQCallback: React.FC = () => {
  const { handleQQCallback } = useUserModel();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('正在处理QQ登录...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleQQCallback();

        if (result.success) {
          setStatus('success');
          setMessage('QQ登录成功！正在跳转...');

          // 2秒后跳转到首页
          setTimeout(() => {
            history.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.message || 'QQ登录失败');

          // 3秒后跳转到登录页
          setTimeout(() => {
            history.push('/login');
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('QQ登录处理异常');

        // 3秒后跳转到登录页
        setTimeout(() => {
          history.push('/login');
        }, 3000);
      }
    };

    processCallback();
  }, [handleQQCallback]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        );
      case 'success':
        return (
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
        {...fadeInUp}
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {getStatusIcon()}
        </motion.div>

        <motion.h1
          className={`text-2xl font-bold mb-4 ${getStatusColor()}`}
          {...fadeInUp}
          transition={{ delay: 0.3 }}
        >
          QQ登录处理
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6"
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>

        {status === 'error' && (
          <motion.button
            onClick={() => history.push('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            返回登录
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default QQCallback;

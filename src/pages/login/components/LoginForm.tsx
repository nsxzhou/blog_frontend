import type { LoginReq } from '@/api/user';
import { Button } from '@/components/ui';
import { fadeInUp, hoverScale, hoverScaleSmall } from '@/constants/animations';
import useUserModel from '@/models/user';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  QqOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const { login, qqLogin } = useUserModel();

  const [formData, setFormData] = useState<LoginReq>({
    username: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginReq>>({});
  const [loading, setLoading] = useState(false);
  const [qqLoading, setQqLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginReq> = {};

    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名或邮箱';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(formData);

      if (result?.success) {
        // 清空表单数据
        setFormData({
          username: '',
          password: '',
          remember: false,
        });

        setTimeout(() => {
          onSuccess();
        }, 100);
      }
    } catch (error) {
      console.error('登录异常:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQQLogin = async () => {
    setQqLoading(true);
    try {
      await qqLogin();
    } catch (error) {
      console.error('QQ登录异常:', error);
    } finally {
      setQqLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginReq, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial="hidden"
      animate="visible"
    >
      {/* 用户名输入 */}
      <motion.div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          用户名或邮箱
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserOutlined className="text-gray-400" />
          </div>
          <motion.input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`
              w-full pl-10 pr-4 py-3 border rounded-lg
              focus:border-blue-500
              transition-all duration-200 outline-none
              ${
                errors.username
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }
            `}
            placeholder="请输入用户名或邮箱"
          />
        </div>
        {errors.username && (
          <motion.p {...fadeInUp} className="mt-1 text-sm text-red-600">
            {errors.username}
          </motion.p>
        )}
      </motion.div>

      {/* 密码输入 */}
      <motion.div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          密码
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockOutlined className="text-gray-400" />
          </div>
          <motion.input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`
              w-full pl-10 pr-12 py-3 border rounded-lg
            focus:border-blue-500
              transition-all duration-200 outline-none
              ${
                errors.password
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }
            `}
            placeholder="请输入密码"
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            {...hoverScaleSmall}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </motion.button>
        </div>
        {errors.password && (
          <motion.p {...fadeInUp} className="mt-1 text-sm text-red-600">
            {errors.password}
          </motion.p>
        )}
      </motion.div>

      {/* 记住密码选项 */}
      <motion.div className="flex items-center justify-between">
        <label className="flex items-center">
          <motion.input
            type="checkbox"
            checked={formData.remember}
            onChange={(e) => handleInputChange('remember', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            whileTap={{ scale: 0.9 }}
          />
          <span className="ml-2 text-sm text-gray-600">延长登录时间</span>
        </label>
        <motion.button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          {...hoverScale}
        >
          忘记密码？
        </motion.button>
      </motion.div>

      {/* 登录按钮 */}
      <motion.div>
        <Button
          variant="primary"
          type="submit"
          className="w-full py-3"
          disabled={loading}
        >
          登录
        </Button>
      </motion.div>

      {/* 分割线 */}
      <motion.div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">或</span>
        </div>
      </motion.div>

      {/* QQ登录按钮 */}
      <motion.div>
        <motion.button
          type="button"
          onClick={handleQQLogin}
          disabled={qqLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-blue-500 rounded-lg text-blue-600 font-medium bg-white hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          {...hoverScale}
        >
          <QqOutlined className="text-xl" />
          {qqLoading ? '跳转中...' : 'QQ 登录'}
        </motion.button>
      </motion.div>

      {/* 注册链接 */}
      <motion.div className="text-center">
        <span className="text-gray-600">还没有账户？</span>
        <motion.button
          type="button"
          onClick={onSwitchToRegister}
          className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          {...hoverScale}
        >
          立即注册
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;

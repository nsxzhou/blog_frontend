import type { RegisterReq } from '@/api/user';
import { Button } from '@/components/ui';
import { validation } from '@/utils/validation';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { connect } from '@umijs/max';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  dispatch: any;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  dispatch,
}) => {
  const [formData, setFormData] = useState<RegisterReq>({
    username: '',
    nickname: '',
    email: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<RegisterReq & { confirmPassword: string }>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterReq & { confirmPassword: string }> = {};

    // 用户名验证
    const usernameResult = validation.username.validate(formData.username);
    if (!usernameResult.isValid) {
      newErrors.username = usernameResult.error;
    }

    // 昵称验证
    const nicknameResult = validation.nickname.validate(formData.nickname);
    if (!nicknameResult.isValid) {
      newErrors.nickname = nicknameResult.error;
    }

    // 邮箱验证（使用更严格的验证）
    const emailResult = validation.email.validate(formData.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error;
    }

    // 密码验证
    const passwordResult = validation.password.basic(formData.password);
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.error;
    }

    // 确认密码验证
    const confirmPasswordResult = validation.confirmPassword(
      formData.password,
      confirmPassword,
    );
    if (!confirmPasswordResult.isValid) {
      newErrors.confirmPassword = confirmPasswordResult.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch({
        type: 'user/register',
        payload: formData,
      });

      if (result?.success) {
        onSuccess();
      }
    } catch (error) {
      console.error('注册失败:', error);
    }
  };

  const handleInputChange = (
    field: keyof (RegisterReq & { confirmPassword: string }),
    value: string,
  ) => {
    if (field === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

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
      className="space-y-4"
      initial="hidden"
      animate="visible"
    >
      {/* 用户名输入 */}
      <motion.div custom={0}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          用户名
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
            placeholder="请输入用户名"
          />
        </div>
        {errors.username && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-1 text-sm text-red-600"
            transition={{ duration: 0.2 }}
          >
            {errors.username}
          </motion.p>
        )}
      </motion.div>

      {/* 昵称输入 */}
      <motion.div custom={1}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          昵称
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <TeamOutlined className="text-gray-400" />
          </div>
          <motion.input
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange('nickname', e.target.value)}
            className={`
              w-full pl-10 pr-4 py-3 border rounded-lg
              focus:border-blue-500
              transition-all duration-200 outline-none
              ${
                errors.nickname
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }
            `}
            placeholder="请输入昵称"
          />
        </div>
        {errors.nickname && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-1 text-sm text-red-600"
            transition={{ duration: 0.2 }}
          >
            {errors.nickname}
          </motion.p>
        )}
      </motion.div>

      {/* 邮箱输入 */}
      <motion.div custom={2}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          邮箱
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MailOutlined className="text-gray-400" />
          </div>
          <motion.input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`
              w-full pl-10 pr-4 py-3 border rounded-lg
              focus:border-blue-500
              transition-all duration-200 outline-none
              ${
                errors.email
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }
            `}
            placeholder="请输入邮箱地址"
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-1 text-sm text-red-600"
            transition={{ duration: 0.2 }}
          >
            {errors.email}
          </motion.p>
        )}
      </motion.div>

      {/* 密码输入 */}
      <motion.div custom={3}>
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </motion.button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-1 text-sm text-red-600"
            transition={{ duration: 0.2 }}
          >
            {errors.password}
          </motion.p>
        )}
      </motion.div>

      {/* 确认密码输入 */}
      <motion.div custom={4}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          确认密码
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockOutlined className="text-gray-400" />
          </div>
          <motion.input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) =>
              handleInputChange('confirmPassword', e.target.value)
            }
            className={`
              w-full pl-10 pr-12 py-3 border rounded-lg
                focus:border-blue-500
              transition-all duration-200 outline-none
              ${
                errors.confirmPassword
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              }
            `}
            placeholder="请再次输入密码"
          />
          <motion.button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </motion.button>
        </div>
        {errors.confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-1 text-sm text-red-600"
            transition={{ duration: 0.2 }}
          >
            {errors.confirmPassword}
          </motion.p>
        )}
      </motion.div>

      {/* 注册按钮 */}
      <motion.div>
        <Button type="submit" variant="primary" size="lg" className="w-full">
          注册
        </Button>
      </motion.div>

      {/* 切换到登录 */}
      <motion.div className="text-center">
        <span className="text-gray-600">已有账户？</span>
        <motion.button
          type="button"
          onClick={onSwitchToLogin}
          className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          立即登录
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default connect()(RegisterForm);

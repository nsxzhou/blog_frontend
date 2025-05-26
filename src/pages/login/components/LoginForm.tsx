import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from '@umijs/max';
import { Button } from '@/components/ui';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import type { LoginReq } from '@/api/user';

interface LoginFormProps {
    onSuccess: () => void;
    onSwitchToRegister: () => void;
}

// 优化的输入框动画变体 - 减少延迟，提升响应速度
const inputVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { 
            duration: 0.3, 
            ease: "easeOut",
            delay: i * 0.08
        }
    })
};

const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut", delay: 0.25 }
    }
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: any) => state.user);

    const [formData, setFormData] = useState<LoginReq>({
        username: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginReq>>({});

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

        try {
                  const result = await dispatch({
        type: 'user/login',
        payload: formData,
      }) as unknown as { success: boolean; data?: any };
      
      if (result?.success) {
                onSuccess();
            }
        } catch (error) {
            console.error('登录失败:', error);
        }
    };

    const handleInputChange = (field: keyof LoginReq, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // 清除对应字段的错误
        if (errors[field]) {
            setErrors(prev => ({
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
            <motion.div variants={inputVariants} custom={0}>
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
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200 outline-none
              ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
            `}
                        placeholder="请输入用户名或邮箱"
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.15 }}
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

            {/* 密码输入 */}
            <motion.div variants={inputVariants} custom={1}>
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
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200 outline-none
              ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
            `}
                        placeholder="请输入密码"
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.15 }}
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

            {/* 记住密码选项 */}
            <motion.div
                variants={inputVariants}
                custom={2}
                className="flex items-center justify-between"
            >
                <label className="flex items-center">
                    <motion.input
                        type="checkbox"
                        checked={formData.remember}
                        onChange={(e) => handleInputChange('remember', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        whileTap={{ scale: 0.9 }}
                    />
                    <span className="ml-2 text-sm text-gray-600">记住我</span>
                </label>
                <motion.button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    忘记密码？
                </motion.button>
            </motion.div>

            {/* 登录按钮 */}
            <motion.div variants={buttonVariants}>
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <motion.div
                            className="flex items-center justify-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            登录中...
                        </motion.div>
                    ) : (
                        '登录'
                    )}
                </Button>
            </motion.div>

            {/* 切换到注册 */}
            <motion.div
                variants={buttonVariants}
                className="text-center"
            >
                <span className="text-gray-600">还没有账户？</span>
                <motion.button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    立即注册
                </motion.button>
            </motion.div>
        </motion.form>
    );
};

export default LoginForm;
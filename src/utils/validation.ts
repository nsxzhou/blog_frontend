/**
 * 表单验证工具函数
 */

// 邮箱验证相关
export const emailValidation = {
  // 基础邮箱验证（当前使用的）
  basic: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // 严格邮箱验证（推荐使用）
  strict: (email: string): boolean => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
  },

  // 更严格的邮箱验证（符合 RFC 5322 标准的简化版）
  rfc5322: (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email) && email.length <= 254;
  },

  // 验证邮箱格式并返回详细信息
  validate: (email: string): { isValid: boolean; error?: string } => {
    if (!email || !email.trim()) {
      return { isValid: false, error: '请输入邮箱' };
    }

    const trimmedEmail = email.trim();

    // 长度检查
    if (trimmedEmail.length > 254) {
      return { isValid: false, error: '邮箱地址过长' };
    }

    // 基本格式检查
    if (!emailValidation.strict(trimmedEmail)) {
      return { isValid: false, error: '请输入有效的邮箱地址' };
    }

    // 检查本地部分长度（@符号前的部分）
    const [localPart] = trimmedEmail.split('@');
    if (localPart.length > 64) {
      return { isValid: false, error: '邮箱用户名部分过长' };
    }

    // 检查是否包含连续的点
    if (trimmedEmail.includes('..')) {
      return { isValid: false, error: '邮箱格式不正确' };
    }

    // 检查是否以点开头或结尾
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return { isValid: false, error: '邮箱格式不正确' };
    }

    return { isValid: true };
  },

  // 常见邮箱域名验证
  isCommonDomain: (email: string): boolean => {
    const commonDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'qq.com',
      '163.com',
      '126.com',
      'sina.com',
      'sohu.com',
      'foxmail.com',
      'aliyun.com',
      'yeah.net',
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return commonDomains.includes(domain);
  },
};

// 用户名验证
export const usernameValidation = {
  validate: (username: string): { isValid: boolean; error?: string } => {
    if (!username || !username.trim()) {
      return { isValid: false, error: '请输入用户名' };
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
      return { isValid: false, error: '用户名至少3位字符' };
    }

    if (trimmedUsername.length > 20) {
      return { isValid: false, error: '用户名不能超过20位字符' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return { isValid: false, error: '用户名只能包含字母、数字和下划线' };
    }

    // 不能以数字开头
    if (/^\d/.test(trimmedUsername)) {
      return { isValid: false, error: '用户名不能以数字开头' };
    }

    // 不能全是数字
    if (/^\d+$/.test(trimmedUsername)) {
      return { isValid: false, error: '用户名不能全是数字' };
    }

    return { isValid: true };
  },
};

// 密码验证
export const passwordValidation = {
  // 基础密码验证
  basic: (password: string): { isValid: boolean; error?: string } => {
    if (!password) {
      return { isValid: false, error: '请输入密码' };
    }

    if (password.length < 6) {
      return { isValid: false, error: '密码至少6位字符' };
    }

    return { isValid: true };
  },

  // 强密码验证
  strong: (
    password: string,
  ): {
    isValid: boolean;
    error?: string;
    strength: 'weak' | 'medium' | 'strong';
  } => {
    if (!password) {
      return { isValid: false, error: '请输入密码', strength: 'weak' };
    }

    if (password.length < 8) {
      return { isValid: false, error: '密码至少8位字符', strength: 'weak' };
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    let score = 0;

    // 长度检查
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // 复杂度检查
    if (/[a-z]/.test(password)) score += 1; // 小写字母
    if (/[A-Z]/.test(password)) score += 1; // 大写字母
    if (/\d/.test(password)) score += 1; // 数字
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1; // 特殊字符

    if (score >= 5) strength = 'strong';
    else if (score >= 3) strength = 'medium';

    if (score < 3) {
      return {
        isValid: false,
        error: '密码强度不够，请包含大小写字母、数字和特殊字符',
        strength,
      };
    }

    return { isValid: true, strength };
  },
};

// 手机号验证
export const phoneValidation = {
  validate: (phone: string): { isValid: boolean; error?: string } => {
    if (!phone || !phone.trim()) {
      return { isValid: true }; // 手机号通常是可选的
    }

    const trimmedPhone = phone.trim();

    // 中国大陆手机号验证
    if (!/^1[3-9]\d{9}$/.test(trimmedPhone)) {
      return { isValid: false, error: '请输入有效的手机号码' };
    }

    return { isValid: true };
  },
};

// 昵称验证
export const nicknameValidation = {
  validate: (nickname: string): { isValid: boolean; error?: string } => {
    if (!nickname || !nickname.trim()) {
      return { isValid: false, error: '请输入昵称' };
    }

    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length < 2) {
      return { isValid: false, error: '昵称至少2位字符' };
    }

    if (trimmedNickname.length > 20) {
      return { isValid: false, error: '昵称不能超过20位字符' };
    }

    // 允许中文、英文、数字、下划线、短横线
    if (!/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/.test(trimmedNickname)) {
      return {
        isValid: false,
        error: '昵称只能包含中英文、数字、下划线和短横线',
      };
    }

    return { isValid: true };
  },
};

// 通用验证函数
export const validation = {
  email: emailValidation,
  username: usernameValidation,
  password: passwordValidation,
  phone: phoneValidation,
  nickname: nicknameValidation,

  // 确认密码验证
  confirmPassword: (
    password: string,
    confirmPassword: string,
  ): { isValid: boolean; error?: string } => {
    if (!confirmPassword) {
      return { isValid: false, error: '请确认密码' };
    }

    if (confirmPassword !== password) {
      return { isValid: false, error: '两次输入的密码不一致' };
    }

    return { isValid: true };
  },
};

export default validation;

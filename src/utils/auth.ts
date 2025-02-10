// 创建认证工具函数
export const checkAuth = (token?: string) => {
  if (!token) {
    return false;
  }

  try {
    // 验证token是否过期
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp < Date.now() / 1000) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

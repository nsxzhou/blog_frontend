import { refreshToken } from "@/api/system";
import { updateToken } from "@/store/slice";
import store from "@/store";

// 创建认证工具函数
export const checkAuth = async (token?: string) => {
  if (!token) {
    return false;
  }

  try {
    // 验证token是否过期
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 如果token已过期或即将过期（比如还有5分钟过期）
    const fiveMinutes = 5 * 60;
    if (payload.exp - Date.now() / 1000 < fiveMinutes) {
      // 获取用户ID
      const userId = payload.user_id || payload.sub;
      // 自动刷新token
      const newToken = await autoRefreshToken(token, userId);
      if (newToken) {
        return true;
      }
      return false;
    }
    return true;
  } catch (error) {
    console.error("验证token失败:", error);
    return false;
  }
};

// 添加自动刷新token的函数
export const autoRefreshToken = async (token: string, userId: string) => {
  try {
    // 调用刷新token接口
    const response = await refreshToken({
      token: token,
      user_id: userId,
    });

    if (response.code === 0 && response.data) {
      store.dispatch(updateToken(response.data));
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("刷新token失败:", error);
    return null;
  }
};

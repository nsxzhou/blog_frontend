// 权限配置
export default function access(
  initialState:
    | {
        name: string;
        currentUser?: any;
        token?: string;
        refreshToken?: string;
        isLoggedIn: boolean;
      }
    | undefined,
) {
  const { isLoggedIn } = initialState || { isLoggedIn: false };
  return {
    // 是否已登录
    canAccess: !!isLoggedIn,
    // 是否是管理员
    isAdmin: initialState?.currentUser?.role === 'admin',
  };
}

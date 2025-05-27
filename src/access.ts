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

  console.log('权限检查 - initialState:', initialState);
  console.log('权限检查 - isLoggedIn:', isLoggedIn);

  return {
    // 是否已登录
    canAccess: !!isLoggedIn,
  };
}

// 权限配置
export default function access(
  initialState:
    | {
        name: string;
        currentUser?: any;
        isLoggedIn: boolean;
      }
    | undefined,
) {
  const { isLoggedIn, currentUser } = initialState || { isLoggedIn: false };

  return {
    // 是否已登录
    canAccess: !!isLoggedIn,

    // 是否是管理员
    isAdmin: currentUser?.role === 'admin',

    // 是否可以访问用户功能
    canUser: !!isLoggedIn,

    // 是否可以编辑文章
    canEdit: !!isLoggedIn,

    // 是否可以删除文章
    canDelete:
      !!isLoggedIn &&
      (currentUser?.role === 'admin' || currentUser?.role === 'editor'),

    // 已登录用户不应该访问的页面（如登录页）
    shouldNotAccess: !isLoggedIn,
  };
}

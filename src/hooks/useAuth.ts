import { useModel } from '@umijs/max';

export const useAuth = () => {
  const { initialState, loading } = useModel('@@initialState');

  const isLoggedIn = initialState?.isLoggedIn || false;
  const currentUser = initialState?.currentUser;
  const token = initialState?.token;

  return {
    // 用户状态
    isLoggedIn,
    currentUser,
    token,
    loading,

    // 权限检查
    canWrite: isLoggedIn && !!currentUser,
    canManageArticles: isLoggedIn && !!currentUser,
    canAccessAuthPages: isLoggedIn && !!currentUser,
  };
};

export default useAuth;

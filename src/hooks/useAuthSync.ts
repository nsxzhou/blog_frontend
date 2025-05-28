import { useDispatch, useModel, useSelector } from '@umijs/max';

/**
 * 用户认证状态同步hook
 */
export const useAuthSync = () => {
  const dispatch = useDispatch();
  const { initialState, setInitialState } = useModel('@@initialState');
  const userState = useSelector((state: any) => state.user);

  // 同步登录状态
  const syncLoginState = async (userData: any) => {
    const { access_token, refresh_token, user } = userData;

    // 更新全局状态
    await setInitialState((prev: any) => ({
      ...prev,
      currentUser: user,
      token: access_token,
      refreshToken: refresh_token,
      isLoggedIn: true,
    }));

    // 更新dva状态
    dispatch({
      type: 'user/setUserState',
      payload: {
        currentUser: user,
        token: access_token,
        refreshToken: refresh_token,
        isLoggedIn: true,
      },
    });
  };

  // 同步登出状态
  const syncLogoutState = async () => {
    await setInitialState((prev: any) => ({
      ...prev,
      currentUser: null,
      token: null,
      refreshToken: null,
      isLoggedIn: false,
    }));

    dispatch({ type: 'user/clearUserState' });
  };

  const state = initialState as any;

  return {
    isLoggedIn: state?.isLoggedIn || userState?.isLoggedIn || false,
    currentUser: state?.currentUser || userState?.currentUser || null,
    syncLoginState,
    syncLogoutState,
  };
};

export default useAuthSync;

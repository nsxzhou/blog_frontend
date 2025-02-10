import { message, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index";
import { RootState } from "./store/index";
import { initializeFromStorage, logout } from "./store/slice";
import { checkAuth } from "./utils/auth";
export const App = () => {
  const isInitialized = useSelector(
    (state: RootState) => state.web.isInitialized
  );
  const userInfo = useSelector((state: RootState) => state.web.user.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && userInfo && !checkAuth(userInfo.token)) {
      message.error("登录已过期");
      dispatch(logout());
    }
  }, [isInitialized, userInfo, dispatch]);

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <Spin size="large" className="scale-150" />
      </div>
    );
  }

  return (
    <div className="app">
      <RouterProvider future={{ v7_startTransition: true }} router={router} />
    </div>
  );
};

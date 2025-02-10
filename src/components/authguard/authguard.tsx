import { RootState } from "@/store";
import { message } from "antd";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * AuthGuard 组件 - 用于保护需要登录才能访问的路由
 *
 * 功能说明：
 * 1. 检查用户是否已登录
 * 2. 如果用户未登录且尝试访问 /admin 开头的路由，则重定向到登录页面
 * 3. 如果用户已登录或访问的不是受保护路由，则正常显示子组件
 *
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} 返回子组件或重定向组件
 */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // 获取当前路由信息
  const location = useLocation();

  // 从 Redux store 中获取用户登录状态和角色信息
  const isLoggedIn = useSelector((state: RootState) => state.web.user.isLogin);
  const userRole = useSelector(
    (state: RootState) => state.web.user.userInfo?.role
  );

  // 使用 useMemo 缓存判断结果，增加对用户角色的判断
  const needRedirect = useMemo(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");
    if (!isAdminRoute) return false;
    if (!isLoggedIn) return true;
    return userRole !== "admin";
  }, [isLoggedIn, location.pathname, userRole]);

  // 在渲染过程中不直接显示消息提示
  useEffect(() => {
    if (needRedirect) {
      // 根据不同情况显示不同的提示信息
      if (!isLoggedIn) {
        message.warning("请先登录");
      } else if (userRole !== "admin") {
        message.error("您没有权限访问该页面");
      }
    }
  }, [needRedirect, isLoggedIn, userRole]);

  // 根据判断结果返回相应组件
  if (needRedirect) {
    // 根据不同情况跳转到不同页面
    if (!isLoggedIn) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

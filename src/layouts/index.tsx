import { GetUserInfo } from '@/api/user';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getRouteAccess } from '@/utils/routeAccess';
import { connect, Outlet, useDispatch, useLocation } from '@umijs/max';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import StagewiseWrapper from '../components/StagewiseWrapper';
import { Footer, Header } from './components';

interface GlobalLayoutProps {
  user: any;
}

// 抽离背景动画组件
const BackgroundAnimation: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <motion.div
      className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
    <motion.div
      className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1,
      }}
    />
  </div>
);

// 抽离主内容区域组件
const MainContent: React.FC<{ pathname: string }> = ({ pathname }) => (
  <main className="pt-16 min-h-screen relative z-10">
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <ProtectedRoute requiredRole={getRouteAccess(pathname)}>
        <Outlet />
      </ProtectedRoute>
    </motion.div>
  </main>
);

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  // 使用 useCallback 优化事件处理函数
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // 路由变化时关闭侧边栏
  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  // 用户信息初始化
  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await GetUserInfo();
      if (res.code === 0) {
        dispatch({
          type: 'user/setUser',
          payload: res.data.user,
        });
      }
    };
    fetchUserInfo();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      <StagewiseWrapper />
      <BackgroundAnimation />
      <Header onMenuToggle={toggleSidebar} />
      <MainContent pathname={location.pathname} />
      <Footer />
    </div>
  );
};

export default connect(({ user }: any) => ({ user }))(GlobalLayout);

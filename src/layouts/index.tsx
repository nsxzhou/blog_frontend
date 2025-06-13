import ProtectedRoute from '@/components/ProtectedRoute';
import { getRouteAccess } from '@/utils/routeAccess';
import { connect, Outlet, useLocation } from '@umijs/max';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import StagewiseWrapper from '../components/StagewiseWrapper';
import { Footer, Header } from './components';

interface GlobalLayoutProps {
  currentUser: any;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      {/* Stagewise Toolbar (development only) */}
      <StagewiseWrapper />

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

      {/* 头部导航 */}
      <Header onMenuToggle={toggleSidebar} />

      {/* 侧边栏 */}
      {/* <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} /> */}

      {/* 主内容区域 */}
      <main className="pt-16 min-h-screen relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <ProtectedRoute access={getRouteAccess(location.pathname)}>
            <Outlet />
          </ProtectedRoute>
        </motion.div>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
};

export default GlobalLayout;

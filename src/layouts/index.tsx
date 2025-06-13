import { GetUserInfo } from '@/api/user';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserModelState } from '@/models/user';
import { WebSocketState } from '@/models/websocket';
import { getTokenFromStorage } from '@/utils/auth';
import { getRouteAccess } from '@/utils/routeAccess';
import { getWebSocketURL } from '@/utils/websocket';
import { connect, Outlet, useDispatch, useLocation } from '@umijs/max';
import { Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import StagewiseWrapper from '../components/StagewiseWrapper';
import { Footer, Header } from './components';

interface GlobalLayoutProps {
  user: UserModelState;
  websocket: WebSocketState;
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

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ user, websocket }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      // 如果没有 token，直接结束加载流程
      const token = getTokenFromStorage();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await GetUserInfo();
        if (res.code === 0) {
          dispatch({
            type: 'user/setUser',
            payload: res.data.user,
          });
        }
      } catch (error) {
        // 这里不需要额外处理，统一错误拦截器会处理
        console.error('获取用户信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [dispatch]);

  // WebSocket连接初始化
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;

    const token = getTokenFromStorage();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const connectWebSocket = () => {
      if (
        websocket.status === 'connected' ||
        websocket.status === 'connecting'
      ) {
        return;
      }

      dispatch({
        type: 'websocket/setStatus',
        payload: {
          status: 'connecting',
          message: '正在连接...',
        },
      });
      const ws = new WebSocket(getWebSocketURL());

      ws.onopen = () => {
        dispatch({
          type: 'websocket/setStatus',
          payload: {
            status: 'connected',
            message: '已连接',
          },
        });
        dispatch({
          type: 'websocket/setSocket',
          payload: ws,
        });
        dispatch({
          type: 'websocket/resetReconnectAttempts',
        });
      };

      ws.onclose = () => {
        dispatch({
          type: 'websocket/setStatus',
          payload: {
            status: 'disconnected',
            message: '连接已断开',
          },
        });
        dispatch({
          type: 'websocket/setSocket',
          payload: null,
        });

        // 重连逻辑
        if (websocket.reconnectAttempts < websocket.maxReconnectAttempts) {
          dispatch({
            type: 'websocket/setStatus',
            payload: {
              status: 'reconnecting',
              message: `正在重连... (${websocket.reconnectAttempts + 1}/${
                websocket.maxReconnectAttempts
              })`,
            },
          });
          dispatch({
            type: 'websocket/incrementReconnectAttempts',
          });
          reconnectTimer = setTimeout(
            connectWebSocket,
            websocket.reconnectInterval,
          );
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        dispatch({
          type: 'websocket/setStatus',
          payload: {
            status: 'disconnected',
            message: '连接错误',
          },
        });
      };
    };

    connectWebSocket();

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (websocket.socket) {
        websocket.socket.close();
      }
    };
  }, [dispatch, user.isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      <StagewiseWrapper />
      <BackgroundAnimation />
      <Header onMenuToggle={toggleSidebar} />
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <MainContent pathname={location.pathname} />
      )}
      <Footer />
    </div>
  );
};

export default connect(
  ({
    user,
    websocket,
  }: {
    user: UserModelState;
    websocket: WebSocketState;
  }) => ({
    user,
    websocket,
  }),
)(GlobalLayout);

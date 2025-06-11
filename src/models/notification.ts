import type { NotificationItem } from '@/api/notification';
import {
  GetNotifications,
  GetUnreadCount,
  MarkAllNotificationsAsRead,
  MarkNotificationAsRead,
} from '@/api/notification';
import type { WebSocketMessage } from '@/hooks/useWebSocket';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
}

export interface UseNotificationModelReturn {
  // 状态
  state: NotificationState;
  isConnected: boolean;
  connectionStatus: string;

  // 通知数据操作
  fetchNotifications: (
    page?: number,
    pageSize?: number,
    refresh?: boolean,
  ) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // WebSocket操作
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  reconnectWebSocket: () => void;

  // 浏览器通知
  requestNotificationPermission: () => Promise<boolean>;
  showBrowserNotification: (title: string, body: string, icon?: string) => void;
}

export default function useNotificationModel(): UseNotificationModelReturn {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    loading: false,
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  // 处理WebSocket消息
  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    console.log('收到WebSocket消息:', wsMessage);

    switch (wsMessage.type) {
      case 'notification':
        // 新通知
        const newNotification = wsMessage.data as NotificationItem;
        setState((prev) => ({
          ...prev,
          notifications: [newNotification, ...prev.notifications],
          unreadCount: prev.unreadCount + 1,
        }));

        // 显示浏览器通知
        showBrowserNotification(
          '新通知',
          newNotification.content,
          newNotification.sender?.avatar,
        );

        // 广播给其他标签页
        broadcastToOtherTabs({
          type: 'NEW_NOTIFICATION',
          data: newNotification,
        });
        break;

      case 'notification_read':
        // 通知已读
        const readNotificationId = wsMessage.data.id;
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) =>
            n.id === readNotificationId ? { ...n, is_read: true } : n,
          ),
          unreadCount: Math.max(0, prev.unreadCount - 1),
        }));
        break;

      case 'pong':
        // 心跳响应
        console.log('收到心跳响应');
        break;

      default:
        console.log('未知消息类型:', wsMessage.type);
    }
  }, []);

  // WebSocket连接
  const {
    status: wsStatus,
    connect,
    disconnect,
    reconnect,
    isConnected,
  } = useWebSocket({
    url: 'ws://127.0.0.1:8080/api/ws/connect',
    onMessage: handleWebSocketMessage,
    autoConnect: !!currentUser, // 只有登录用户才自动连接
  });

  // 获取通知列表
  const fetchNotifications = useCallback(
    async (page = 1, pageSize = 10, refresh = false) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const response = await GetNotifications({
          page,
          page_size: pageSize,
        });

        if (response.code === 0) {
          setState((prev) => ({
            ...prev,
            notifications: refresh
              ? response.data.list
              : page === 1
              ? response.data.list
              : [...prev.notifications, ...response.data.list],
            total: response.data.total,
            unreadCount: response.data.unread_count,
            currentPage: page,
            pageSize,
          }));
        }
      } catch (error) {
        console.error('获取通知列表失败:', error);
        message.error('获取通知列表失败');
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [],
  );

  // 获取未读数量
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await GetUnreadCount();
      if (response.code === 0) {
        setState((prev) => ({
          ...prev,
          unreadCount: response.data.count,
        }));
      }
    } catch (error) {
      console.error('获取未读数量失败:', error);
    }
  }, []);

  // 标记单个通知为已读
  const markAsRead = useCallback(async (id: number) => {
    try {
      const response = await MarkNotificationAsRead(id);
      if (response.code === 0) {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n,
          ),
          unreadCount: Math.max(0, prev.unreadCount - 1),
        }));

        // 广播给其他标签页
        broadcastToOtherTabs({
          type: 'NOTIFICATION_READ',
          data: { id },
        });
      }
    } catch (error) {
      console.error('标记已读失败:', error);
      message.error('标记已读失败');
    }
  }, []);

  // 标记所有通知为已读
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await MarkAllNotificationsAsRead();
      if (response.code === 0) {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) => ({
            ...n,
            is_read: true,
          })),
          unreadCount: 0,
        }));

        // 广播给其他标签页
        broadcastToOtherTabs({
          type: 'ALL_NOTIFICATIONS_READ',
          data: {},
        });

        message.success('已标记所有通知为已读');
      }
    } catch (error) {
      console.error('标记所有已读失败:', error);
      message.error('标记所有已读失败');
    }
  }, []);

  // 刷新通知
  const refreshNotifications = useCallback(async () => {
    await Promise.all([
      fetchNotifications(1, state.pageSize, true),
      fetchUnreadCount(),
    ]);
  }, [fetchNotifications, fetchUnreadCount, state.pageSize]);

  // 请求浏览器通知权限
  const requestNotificationPermission =
    useCallback(async (): Promise<boolean> => {
      if (!('Notification' in window)) {
        console.warn('此浏览器不支持桌面通知');
        return false;
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission === 'denied') {
        return false;
      }

      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }, []);

  // 显示浏览器通知
  const showBrowserNotification = useCallback(
    (title: string, body: string, icon?: string) => {
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
          tag: 'blog-notification',
        });

        // 点击通知时聚焦到当前窗口
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // 5秒后自动关闭
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    },
    [],
  );

  // 跨标签页通信
  const broadcastToOtherTabs = useCallback((data: any) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const event = {
        ...data,
        timestamp: Date.now(),
        tabId: Math.random().toString(36).substr(2, 9),
      };
      localStorage.setItem('notification_broadcast', JSON.stringify(event));
      localStorage.removeItem('notification_broadcast');
    }
  }, []);

  // 监听跨标签页消息
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notification_broadcast' && e.newValue) {
        try {
          const event = JSON.parse(e.newValue);

          switch (event.type) {
            case 'NEW_NOTIFICATION':
              setState((prev) => ({
                ...prev,
                notifications: [event.data, ...prev.notifications],
                unreadCount: prev.unreadCount + 1,
              }));
              break;

            case 'NOTIFICATION_READ':
              setState((prev) => ({
                ...prev,
                notifications: prev.notifications.map((n) =>
                  n.id === event.data.id ? { ...n, is_read: true } : n,
                ),
                unreadCount: Math.max(0, prev.unreadCount - 1),
              }));
              break;

            case 'ALL_NOTIFICATIONS_READ':
              setState((prev) => ({
                ...prev,
                notifications: prev.notifications.map((n) => ({
                  ...n,
                  is_read: true,
                })),
                unreadCount: 0,
              }));
              break;
          }
        } catch (error) {
          console.error('解析跨标签页消息失败:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 初始化数据
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      fetchUnreadCount();
      requestNotificationPermission();
    }
  }, [
    currentUser,
    fetchNotifications,
    fetchUnreadCount,
    requestNotificationPermission,
  ]);

  return {
    // 状态
    state,
    isConnected,
    connectionStatus: wsStatus.message,

    // 通知数据操作
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,

    // WebSocket操作
    connectWebSocket: connect,
    disconnectWebSocket: disconnect,
    reconnectWebSocket: reconnect,

    // 浏览器通知
    requestNotificationPermission,
    showBrowserNotification,
  };
}

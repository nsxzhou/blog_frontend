import type { GetNotificationsReq, NotificationItem } from '@/api/notification';
import {
  GetNotifications,
  GetUnreadCount,
  MarkAllNotificationsAsRead,
  MarkNotificationAsRead,
} from '@/api/notification';
import { create } from 'zustand';

// 定义通知优先级
export type NotificationPriority = 'high' | 'medium' | 'low';

// 扩展通知项类型
export interface EnhancedNotificationItem extends NotificationItem {
  priority: NotificationPriority;
}

interface NotificationState {
  notifications: EnhancedNotificationItem[];
  unreadCount: number;
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  lastCacheTime?: number;

  // Actions
  fetchNotifications: (
    page?: number,
    pageSize?: number,
    filters?: Partial<GetNotificationsReq>,
  ) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: NotificationItem) => void;
  handleRealtimeNotification: (notification: NotificationItem) => void;
}

const CACHE_KEY = 'cached_notifications';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

// 根据通知内容确定优先级
const determinePriority = (
  notification: NotificationItem,
): NotificationPriority => {
  if (notification.type === 'comment' || notification.type === 'comment_reply')
    return 'high';
  if (
    notification.type === 'article_like' ||
    notification.type === 'article_favorite'
  )
    return 'medium';
  return 'low';
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,

  fetchNotifications: async (
    page = 1,
    pageSize = 10,
    filters?: Partial<GetNotificationsReq>,
  ) => {
    set({ loading: true });
    try {
      const params: GetNotificationsReq = {
        page,
        page_size: pageSize,
        ...filters,
      };

      const response = await GetNotifications(params);
      if (response.code === 0) {
        const notificationsWithPriority = response.data.list.map(
          (notification: NotificationItem) => ({
            ...notification,
            priority: determinePriority(notification),
          }),
        );

        set({
          notifications: notificationsWithPriority,
          total: response.data.total,
          unreadCount: response.data.unread_count,
          currentPage: page,
          pageSize,
        });

        // 只缓存第一页的数据
        if (page === 1 && !filters?.type && filters?.is_read === undefined) {
          const cacheData = {
            notifications: notificationsWithPriority,
            timestamp: Date.now(),
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        }
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    const response = await GetUnreadCount();
    if (response.code === 0) {
      set({ unreadCount: response.data.count });
    }
  },

  markAsRead: async (id: number) => {
    const response = await MarkNotificationAsRead(id);
    if (response.code === 0) {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    }
  },

  markAllAsRead: async () => {
    const response = await MarkAllNotificationsAsRead();
    if (response.code === 0) {
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          is_read: true,
        })),
        unreadCount: 0,
      }));
    }
  },

  addNotification: (notification: NotificationItem) => {
    const notificationWithPriority = {
      ...notification,
      priority: determinePriority(notification),
    };
    set((state) => ({
      notifications: [notificationWithPriority, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  handleRealtimeNotification: (notification: NotificationItem) => {
    // 收到实时通知时，直接获取最新数据而不是手动更新状态
    get().fetchNotifications(1, 10);
  },
}));

// src/models/notification.ts
import type { NotificationItem } from '@/api/notification';
import {
  GetNotifications,
  GetUnreadCount,
  MarkAllNotificationsAsRead,
  MarkNotificationAsRead,
} from '@/api/notification';
import type { WebSocketMessage } from '@/models/websocket';
import { Effect, Reducer, Subscription } from '@umijs/max';
import { message } from 'antd';

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  isConnected: boolean;
  connectionStatus: string;
}

export interface NotificationModelType {
  namespace: 'notification';
  state: NotificationState;
  effects: {
    fetchNotifications: Effect;
    fetchUnreadCount: Effect;
    markAsRead: Effect;
    markAllAsRead: Effect;
    refreshNotifications: Effect;
    handleWebSocketMessage: Effect;
    connectWebSocket: Effect;
    disconnectWebSocket: Effect;
    reconnectWebSocket: Effect;
    requestNotificationPermission: Effect;
    showBrowserNotification: Effect;
  };
  reducers: {
    setNotifications: Reducer<NotificationState>;
    setLoading: Reducer<NotificationState>;
    updateUnreadCount: Reducer<NotificationState>;
    addNewNotification: Reducer<NotificationState>;
    updateNotificationReadStatus: Reducer<NotificationState>;
    markAllNotificationsRead: Reducer<NotificationState>;
    updateConnectionStatus: Reducer<NotificationState>;
  };
  subscriptions: { setup: Subscription };
}

export default {
  namespace: 'notification',

  state: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    isConnected: false,
    connectionStatus: '未连接',
  },

  effects: {
    *fetchNotifications(
      { payload }: { payload: any },
      { call, put }: { call: any; put: any },
    ): Generator<any, void, any> {
      const {
        page = 1,
        pageSize = 10,
        refresh = false,
        type,
        is_read,
      } = (payload as any) || {};

      yield put({ type: 'setLoading', payload: true });

      try {
        const response = yield call(GetNotifications, {
          page,
          page_size: pageSize,
          type,
          is_read,
        });

        if (response.code === 0) {
          yield put({
            type: 'setNotifications',
            payload: {
              list: response.data.list,
              total: response.data.total,
              unreadCount: response.data.unread_count,
              currentPage: page,
              pageSize,
              refresh,
            },
          });
        }
      } catch (error) {
        console.error('获取通知列表失败:', error);
        message.error('获取通知列表失败');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *fetchUnreadCount(
      _: any,
      { call, put }: { call: any; put: any },
    ): Generator<any, void, any> {
      try {
        const response = yield call(GetUnreadCount);
        if (response.code === 0) {
          yield put({
            type: 'updateUnreadCount',
            payload: response.data.count,
          });
        }
      } catch (error) {
        console.error('获取未读数量失败:', error);
      }
    },

    *markAsRead(
      { payload }: { payload: any },
      { call, put }: { call: any; put: any },
    ): Generator<any, void, any> {
      const id = payload;
      try {
        const response = yield call(MarkNotificationAsRead, id);
        if (response.code === 0) {
          yield put({
            type: 'updateNotificationReadStatus',
            payload: id,
          });

          // 广播给其他标签页
          const event = {
            type: 'NOTIFICATION_READ',
            data: { id },
            timestamp: Date.now(),
            tabId: Math.random().toString(36).substr(2, 9),
          };
          localStorage.setItem('notification_broadcast', JSON.stringify(event));
          localStorage.removeItem('notification_broadcast');
        }
      } catch (error) {
        console.error('标记已读失败:', error);
        message.error('标记已读失败');
      }
    },

    *markAllAsRead(
      _: any,
      { call, put }: { call: any; put: any },
    ): Generator<any, void, any> {
      try {
        const response = yield call(MarkAllNotificationsAsRead);
        if (response.code === 0) {
          yield put({ type: 'markAllNotificationsRead' });

          // 广播给其他标签页
          const event = {
            type: 'ALL_NOTIFICATIONS_READ',
            data: {},
            timestamp: Date.now(),
            tabId: Math.random().toString(36).substr(2, 9),
          };
          localStorage.setItem('notification_broadcast', JSON.stringify(event));
          localStorage.removeItem('notification_broadcast');

          message.success('已标记所有通知为已读');
        }
      } catch (error) {
        console.error('标记所有已读失败:', error);
        message.error('标记所有已读失败');
      }
    },

    *refreshNotifications(
      _: any,
      { put, select }: { put: any; select: any },
    ): Generator<any, void, any> {
      const { pageSize } = yield select((state: any) => state.notification);
      yield put({
        type: 'fetchNotifications',
        payload: { page: 1, pageSize, refresh: true },
      });
      yield put({ type: 'fetchUnreadCount' });
    },

    *handleWebSocketMessage(
      { payload }: { payload: any },
      { put }: { put: any },
    ): Generator<any, void, any> {
      const wsMessage = payload as WebSocketMessage;

      switch (wsMessage.type) {
        case 'notification':
          // 新通知
          yield put({
            type: 'addNewNotification',
            payload: wsMessage.data,
          });

          // 显示浏览器通知
          yield put({
            type: 'showBrowserNotification',
            payload: {
              title: '新通知',
              body: wsMessage.data.content,
              icon: wsMessage.data.sender?.avatar,
            },
          });

          // 广播给其他标签页
          const event = {
            type: 'NEW_NOTIFICATION',
            data: wsMessage.data,
            timestamp: Date.now(),
            tabId: Math.random().toString(36).substr(2, 9),
          };
          localStorage.setItem('notification_broadcast', JSON.stringify(event));
          localStorage.removeItem('notification_broadcast');
          break;

        case 'notification_read':
          // 通知已读
          yield put({
            type: 'updateNotificationReadStatus',
            payload: wsMessage.data.id,
          });
          break;

        case 'pong':
          // 心跳响应
          console.log('收到心跳响应');
          break;

        default:
          console.log('未知消息类型:', wsMessage.type);
      }
    },

    *connectWebSocket(
      _: any,
      { put }: { put: any },
    ): Generator<any, void, any> {
      // 与websocket模型集成
      yield put({
        type: 'websocket/connect',
        payload: {
          url: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
            window.location.host
          }/api/ws/connect`,
        },
      });
    },

    *disconnectWebSocket(
      _: any,
      { put }: { put: any },
    ): Generator<any, void, any> {
      yield put({ type: 'websocket/disconnect' });
    },

    *reconnectWebSocket(
      _: any,
      { put }: { put: any },
    ): Generator<any, void, any> {
      yield put({ type: 'websocket/reconnect' });
    },

    *requestNotificationPermission(
      _: any,
      { put }: { put: any },
    ): Generator<any, boolean, any> {
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

      try {
        const permission = yield Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('请求通知权限失败:', error);
        return false;
      }
    },

      *showBrowserNotification(
      { payload }: { payload: any },
      { call }: { call: any },
      ): Generator<any, void, any> {
      const { title, body, icon } = payload;

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
  },

  reducers: {
    setNotifications(state: NotificationState, { payload }: { payload: any }) {
      const { list, total, unreadCount, currentPage, pageSize, refresh } =
        payload;

      return {
        ...state,
        notifications: refresh
          ? list
          : currentPage === 1
          ? list
          : [...state.notifications, ...list],
        total,
        unreadCount,
        currentPage,
        pageSize,
      };
    },

    setLoading(state: NotificationState, { payload }: { payload: any }) {
      return {
        ...state,
        loading: payload,
      };
    },

    updateUnreadCount(state: NotificationState, { payload }: { payload: any }) {
      return {
        ...state,
        unreadCount: payload,
      };
    },

    addNewNotification(state: NotificationState, { payload }: { payload: any }) {
      return {
        ...state,
        notifications: [payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    },

    updateNotificationReadStatus(state: NotificationState, { payload }: { payload: any }) {
      const id = payload;

      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    },

    markAllNotificationsRead(state: NotificationState) {
      return {
        ...state,
        notifications: state.notifications.map((n) => ({
          ...n,
          is_read: true,
        })),
        unreadCount: 0,
      };
    },

    updateConnectionStatus(state: NotificationState, { payload }: { payload: any }) {
      return {
        ...state,
        isConnected: payload.isConnected,
        connectionStatus: payload.status,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: { dispatch: any; history: any }): void {
      // 监听路由变化
      history.listen(({ pathname }: { pathname: string }) => {
        // 当用户已登录时进行初始化
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          dispatch({ type: 'fetchNotifications' });
          dispatch({ type: 'fetchUnreadCount' });
          dispatch({ type: 'requestNotificationPermission' });
          dispatch({ type: 'connectWebSocket' });
        }
      });

      // 跨标签页通信
      window.addEventListener('storage', (e) => {
        if (e.key === 'notification_broadcast' && e.newValue) {
          try {
            const event = JSON.parse(e.newValue);

            switch (event.type) {
              case 'NEW_NOTIFICATION':
                dispatch({
                  type: 'addNewNotification',
                  payload: event.data,
                });
                break;

              case 'NOTIFICATION_READ':
                dispatch({
                  type: 'updateNotificationReadStatus',
                  payload: event.data.id,
                });
                break;

              case 'ALL_NOTIFICATIONS_READ':
                dispatch({ type: 'markAllNotificationsRead' });
                break;
            }
          } catch (error) {
            console.error('解析跨标签页消息失败:', error);
          }
        }
      });
    },
  },
};

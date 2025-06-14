import { getWebSocketURL } from '@/utils/websocket';
import { create } from 'zustand';

// 定义WebSocket消息类型
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

// 定义错误类型
export interface WebSocketError {
  code: number;
  message: string;
  timestamp: number;
}

// 定义订阅者回调函数类型
export type SubscriberCallback = (message: WebSocketMessage) => void;

interface WebSocketState {
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  statusMessage: string;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectInterval: number;
  latestNotification?: WebSocketMessage;
  subscribers: { [key: string]: SubscriberCallback[] };
  errors: WebSocketError[];

  // Actions
  init: (url?: string) => void;
  sendMessage: (payload: any) => void;
  close: () => void;
  addSubscriber: (topic: string, callback: SubscriberCallback) => void;
  removeSubscriber: (topic: string, callback: SubscriberCallback) => void;
}

// 将核心变量提升到store外部，确保全局单例
let ws: WebSocket | null = null;
let heartbeatTimer: NodeJS.Timeout | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

export const useWebSocketStore = create<WebSocketState>((set, get) => {
  // 辅助函数
  const cleanup = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        try {
          ws.close();
        } catch (e) {
          console.error('关闭旧 WebSocket 时出错:', e);
        }
      }
      ws = null;
    }
  };

  const startHeartbeat = () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('发送 ping...');
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  };

  const handleMessage = (message: WebSocketMessage) => {
    const state = get();
    const subscribers = state.subscribers[message.type] || [];

    // 通知所有相关订阅者
    subscribers.forEach((callback) => {
      try {
        callback(message);
      } catch (error: any) {
        console.error('执行订阅者回调时出错:', error);
        set((state) => ({
          errors: [
            ...state.errors,
            {
              code: 1001,
              message: `订阅者回调执行失败: ${error.message}`,
              timestamp: Date.now(),
            },
          ],
        }));
      }
    });

    // 更新最新通知
    set({ latestNotification: message });
  };

  return {
    // State
    status: 'disconnected',
    statusMessage: '未连接',
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectInterval: 3000,
    subscribers: {},
    errors: [],

    // Actions
    init: (url?: string) => {
      const state = get();
      if (
        ws &&
        (state.status === 'connected' || state.status === 'connecting')
      ) {
        console.log('WebSocket 正在连接或已连接，阻止重复初始化。');
        return;
      }

      cleanup();

      const wsUrl = url || getWebSocketURL();
      ws = new window.WebSocket(wsUrl);

      set({
        status: 'connecting',
        statusMessage: '正在连接...',
      });

      ws.onopen = () => {
        console.log('WebSocket连接成功');
        set({
          status: 'connected',
          statusMessage: '已连接',
          reconnectAttempts: 0,
        });
        startHeartbeat();
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('WebSocket收到消息:', msg);

          if (msg.type !== 'pong') {
            // 确保消息格式正确
            const message: WebSocketMessage = {
              type: msg.type,
              // 如果是通知类型，保留完整的通知数据结构
              payload: msg.type === 'notification' ? msg.data : msg,
              timestamp: Date.now(),
            };
            handleMessage(message);
          }
        } catch (e: any) {
          console.error('解析 WebSocket 消息失败:', e);
          set((state) => ({
            errors: [
              ...state.errors,
              {
                code: 1000,
                message: `WebSocket消息解析失败: ${e.message}`,
                timestamp: Date.now(),
              },
            ],
          }));
        }
      };

      ws.onerror = (error) => {
        console.log('WebSocket连接异常:', error);
        set({
          status: 'reconnecting',
          statusMessage: '连接异常',
        });
      };

      ws.onclose = (event) => {
        console.log(
          `WebSocket连接关闭，代码: ${event.code}, 原因: ${event.reason}`,
        );
        const state = get();

        if (
          state.status !== 'disconnected' ||
          state.statusMessage !== '已手动断开'
        ) {
          if (state.reconnectAttempts < state.maxReconnectAttempts) {
            const nextAttempt = state.reconnectAttempts + 1;
            set((state) => ({
              status: 'reconnecting',
              statusMessage: `连接已断开，正在进行第 ${nextAttempt} 次重连...`,
              reconnectAttempts: nextAttempt,
            }));
            reconnectTimer = setTimeout(
              () => get().init(url),
              state.reconnectInterval,
            );
          } else {
            set({
              status: 'disconnected',
              statusMessage: '重连失败，已达到最大尝试次数',
            });
            cleanup();
          }
        } else {
          cleanup();
        }
      };
    },

    sendMessage: (payload: any) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      } else {
        console.error('WebSocket 未连接，无法发送消息');
      }
    },

    close: () => {
      console.log('用户手动关闭 WebSocket 连接');
      cleanup();
      set({
        status: 'disconnected',
        statusMessage: '已手动断开',
        reconnectAttempts: 0,
      });
    },

    addSubscriber: (topic: string, callback: SubscriberCallback) => {
      set((state) => {
        const subscribers = state.subscribers[topic] || [];
        return {
          subscribers: {
            ...state.subscribers,
            [topic]: [...subscribers, callback],
          },
        };
      });
    },

    removeSubscriber: (topic: string, callback: SubscriberCallback) => {
      set((state) => {
        const subscribers = state.subscribers[topic] || [];
        return {
          subscribers: {
            ...state.subscribers,
            [topic]: subscribers.filter((cb) => cb !== callback),
          },
        };
      });
    },
  };
});

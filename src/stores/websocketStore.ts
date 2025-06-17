import { getTokenFromStorage } from '@/utils/auth';
import { create } from 'zustand';

// 后端消息格式（与后端保持一致）
export interface NotificationMessage {
  type: 'notification';
  data: any; // 通知数据
  timestamp: number;
  message_id?: string;
}

// WebSocket连接状态
export type WebSocketStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting';

// 消息处理器类型
export type MessageHandler = (message: NotificationMessage) => void;

interface WebSocketState {
  // 连接状态
  status: WebSocketStatus;
  statusMessage: string;

  // 重连配置
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectInterval: number;

  // 消息处理器
  messageHandlers: Set<MessageHandler>;

  // 操作方法
  connect: () => void;
  disconnect: () => void;
  addMessageHandler: (handler: MessageHandler) => void;
  removeMessageHandler: (handler: MessageHandler) => void;
  isConnected: () => boolean;
}

// 全局WebSocket实例
let ws: WebSocket | null = null;
let heartbeatTimer: NodeJS.Timeout | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

// 获取WebSocket URL
const getWebSocketURL = (): string => {
  const token = getTokenFromStorage();
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host;
  return `${protocol}://${host}/api/ws/connect?token=${encodeURIComponent(
    token || '',
  )}`;
};

export const useWebSocketStore = create<WebSocketState>((set, get) => {
  // 清理资源
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
          console.error('关闭WebSocket连接时出错:', e);
        }
      }
      ws = null;
    }
  };

  // 启动心跳
  const startHeartbeat = () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000); // 30秒心跳
  };

  // 处理接收到的消息
  const handleMessage = (rawMessage: any) => {
    const state = get();

    // 忽略心跳响应
    if (rawMessage.type === 'pong') {
      return;
    }

    // 构造标准消息格式
    const message: NotificationMessage = {
      type: 'notification',
      data: rawMessage.data || rawMessage,
      timestamp: rawMessage.timestamp || Date.now(),
      message_id: rawMessage.message_id,
    };

    // 通知所有消息处理器
    state.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('消息处理器执行失败:', error);
      }
    });
  };

  // 连接WebSocket
  const connectWebSocket = () => {
    // 防止重复连接
    if (
      ws &&
      (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING)
    ) {
      console.log('WebSocket已连接或正在连接');
      return;
    }

    // 检查token
    const token = getTokenFromStorage();
    if (!token) {
      console.error('未找到认证token');
      set({ status: 'disconnected', statusMessage: '未登录' });
      return;
    }

    cleanup();

    const wsUrl = getWebSocketURL();
    ws = new WebSocket(wsUrl);

    set({ status: 'connecting', statusMessage: '正在连接...' });

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
        const rawMessage = JSON.parse(event.data);
        handleMessage(rawMessage);
      } catch (error) {
        console.error('解析WebSocket消息失败:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket连接错误:', error);
      set({ status: 'reconnecting', statusMessage: '连接错误' });
    };

    ws.onclose = (event) => {
      console.log(`WebSocket连接关闭: ${event.code} - ${event.reason}`);
      const currentState = get();

      if (currentState.status !== 'disconnected') {
        // 自动重连
        if (
          currentState.reconnectAttempts < currentState.maxReconnectAttempts
        ) {
          const nextAttempt = currentState.reconnectAttempts + 1;
          set({
            status: 'reconnecting',
            statusMessage: `重连中 (${nextAttempt}/${currentState.maxReconnectAttempts})`,
            reconnectAttempts: nextAttempt,
          });

          reconnectTimer = setTimeout(() => {
            connectWebSocket();
          }, currentState.reconnectInterval);
        } else {
          set({
            status: 'disconnected',
            statusMessage: '连接失败',
          });
        }
      }
    };
  };

  return {
    // 状态
    status: 'disconnected',
    statusMessage: '未连接',
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectInterval: 3000,
    messageHandlers: new Set<MessageHandler>(),

    // 方法
    connect: connectWebSocket,

    disconnect: () => {
      cleanup();
      set({
        status: 'disconnected',
        statusMessage: '已断开',
        reconnectAttempts: 0,
      });
    },

    addMessageHandler: (handler: MessageHandler) => {
      set((state) => {
        const newHandlers = new Set(state.messageHandlers);
        newHandlers.add(handler);
        return { messageHandlers: newHandlers };
      });
    },

    removeMessageHandler: (handler: MessageHandler) => {
      set((state) => {
        const newHandlers = new Set(state.messageHandlers);
        newHandlers.delete(handler);
        return { messageHandlers: newHandlers };
      });
    },

    isConnected: () => {
      return get().status === 'connected';
    },
  };
});

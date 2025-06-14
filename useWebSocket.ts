import { getTokenFromStorage } from '@/utils/auth';
import { useCallback, useEffect, useState } from 'react';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface WebSocketStatus {
  status:
    | 'disconnected'
    | 'connecting'
    | 'connected'
    | 'error'
    | 'reconnecting';
  message: string;
  timestamp?: string;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onStatusChange?: (status: WebSocketStatus) => void;
  autoConnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

// 全局单例WebSocket管理
interface WebSocketInstance {
  socket: WebSocket | null;
  status: WebSocketStatus;
  reconnectAttempts: number;
  reconnectTimer: NodeJS.Timeout | null;
  heartbeatTimer: NodeJS.Timeout | null;
  isManualClose: boolean;
  messageHandlers: Set<(message: WebSocketMessage) => void>;
  statusHandlers: Set<(status: WebSocketStatus) => void>;
  connected: boolean;
}

// 全局单例
const globalWsInstance: Record<string, WebSocketInstance> = {};

// 创建或获取单例
function getGlobalWsInstance(url: string): WebSocketInstance {
  if (!globalWsInstance[url]) {
    globalWsInstance[url] = {
      socket: null,
      status: { status: 'disconnected', message: '未连接' },
      reconnectAttempts: 0,
      reconnectTimer: null,
      heartbeatTimer: null,
      isManualClose: false,
      messageHandlers: new Set(),
      statusHandlers: new Set(),
      connected: false,
    };
  }
  return globalWsInstance[url];
}

// 更新WebSocket状态
function updateGlobalStatus(
  instance: WebSocketInstance,
  status: WebSocketStatus['status'],
  message: string,
) {
  const statusObj: WebSocketStatus = {
    status,
    message,
    timestamp: new Date().toLocaleTimeString(),
  };

  instance.status = statusObj;
  instance.connected = status === 'connected';

  // 通知所有状态监听器
  instance.statusHandlers.forEach((handler) => {
    try {
      handler(statusObj);
    } catch (error) {
      console.error('状态处理器错误:', error);
    }
  });
}

// 清理定时器
function clearTimers(instance: WebSocketInstance) {
  if (instance.reconnectTimer) {
    clearTimeout(instance.reconnectTimer);
    instance.reconnectTimer = null;
  }
  if (instance.heartbeatTimer) {
    clearInterval(instance.heartbeatTimer);
    instance.heartbeatTimer = null;
  }
}

// 启动心跳
function startHeartbeat(instance: WebSocketInstance, interval: number) {
  clearInterval(instance.heartbeatTimer!);
  instance.heartbeatTimer = setInterval(() => {
    if (instance.socket?.readyState === WebSocket.OPEN) {
      instance.socket.send(
        JSON.stringify({ type: 'ping', timestamp: Date.now() }),
      );
    }
  }, interval);
}

// 连接WebSocket
async function connectGlobalWs(
  instance: WebSocketInstance,
  url: string,
  options: {
    maxReconnectAttempts: number;
    reconnectInterval: number;
    heartbeatInterval: number;
  },
) {
  if (instance.socket?.readyState === WebSocket.OPEN) {
    return;
  }

  try {
    const token = getTokenFromStorage();
    if (!token) {
      updateGlobalStatus(instance, 'error', '未找到认证token，请先登录');
      return;
    }

    updateGlobalStatus(instance, 'connecting', '正在连接...');
    instance.isManualClose = false;

    // 构建WebSocket URL
    const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
    const socket = new WebSocket(wsUrl);
    instance.socket = socket;

    // 连接打开
    socket.onopen = () => {
      updateGlobalStatus(instance, 'connected', '连接成功');
      instance.reconnectAttempts = 0;
      startHeartbeat(instance, options.heartbeatInterval);
    };

    // 接收消息
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        // 通知所有消息处理器
        instance.messageHandlers.forEach((handler) => {
          try {
            handler(message);
          } catch (error) {
            console.error('消息处理器错误:', error);
          }
        });
      } catch (error) {
        console.error('解析WebSocket消息失败:', error);
      }
    };

    // 连接关闭
    socket.onclose = (event) => {
      clearTimers(instance);
      instance.socket = null;

      if (instance.isManualClose) {
        updateGlobalStatus(instance, 'disconnected', '已断开连接');
      } else {
        updateGlobalStatus(
          instance,
          'disconnected',
          `连接已关闭 (${event.code})`,
        );
        // 自动重连
        if (instance.reconnectAttempts < options.maxReconnectAttempts) {
          scheduleGlobalReconnect(instance, url, options);
        } else {
          updateGlobalStatus(instance, 'error', '连接失败，已达到最大重试次数');
        }
      }
    };

    // 连接错误
    socket.onerror = () => {
      updateGlobalStatus(instance, 'error', '连接错误');
    };

    // 连接超时
    setTimeout(() => {
      if (socket.readyState === WebSocket.CONNECTING) {
        socket.close();
        updateGlobalStatus(instance, 'error', '连接超时');
      }
    }, 10000);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '连接失败';
    updateGlobalStatus(instance, 'error', errorMessage);
  }
}

// 计划重连
function scheduleGlobalReconnect(
  instance: WebSocketInstance,
  url: string,
  options: {
    maxReconnectAttempts: number;
    reconnectInterval: number;
    heartbeatInterval: number;
  },
) {
  instance.reconnectAttempts++;
  const delay =
    options.reconnectInterval * Math.pow(2, instance.reconnectAttempts - 1);

  updateGlobalStatus(
    instance,
    'reconnecting',
    `重连中... (${instance.reconnectAttempts}/${options.maxReconnectAttempts})`,
  );

  instance.reconnectTimer = setTimeout(() => {
    connectGlobalWs(instance, url, options);
  }, Math.min(delay, 30000)); // 最大延迟30秒
}

// 断开连接
function disconnectGlobalWs(instance: WebSocketInstance) {
  instance.isManualClose = true;
  clearTimers(instance);
  if (instance.socket) {
    instance.socket.close(1000, '用户主动断开');
  }
}

// 发送消息
function sendGlobalMessage(instance: WebSocketInstance, message: any): boolean {
  if (instance.socket?.readyState === WebSocket.OPEN) {
    const messageStr =
      typeof message === 'string' ? message : JSON.stringify(message);
    instance.socket.send(messageStr);
    return true;
  }
  return false;
}

// 重连
function reconnectGlobalWs(
  instance: WebSocketInstance,
  url: string,
  options: {
    maxReconnectAttempts: number;
    reconnectInterval: number;
    heartbeatInterval: number;
  },
) {
  instance.reconnectAttempts = 0;
  connectGlobalWs(instance, url, options);
}

// 钩子函数
export function useWebSocket(options: UseWebSocketOptions) {
  const {
    url,
    onMessage,
    onStatusChange,
    autoConnect = false,
    maxReconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 60000,
  } = options;

  // 使用本地状态以便组件更新
  const [status, setStatus] = useState<WebSocketStatus>({
    status: 'disconnected',
    message: '未连接',
  });

  // 获取全局实例
  const wsInstance = getGlobalWsInstance(url);

  // 更新状态的处理函数
  const statusHandler = useCallback(
    (newStatus: WebSocketStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange],
  );

  // 注册/注销处理器
  useEffect(() => {
    const instance = getGlobalWsInstance(url);

    // 初始状态同步
    setStatus(instance.status);

    // 注册处理器
    if (onMessage) {
      instance.messageHandlers.add(onMessage);
    }
    instance.statusHandlers.add(statusHandler);

    // 自动连接
    if (autoConnect && !instance.socket && !instance.isManualClose) {
      connectGlobalWs(instance, url, {
        maxReconnectAttempts,
        reconnectInterval,
        heartbeatInterval,
      });
    }

    // 清理函数
    return () => {
      if (onMessage) {
        instance.messageHandlers.delete(onMessage);
      }
      instance.statusHandlers.delete(statusHandler);

      // 如果没有处理器了，可以考虑关闭连接
      if (
        instance.messageHandlers.size === 0 &&
        instance.statusHandlers.size === 0
      ) {
        // 可选: 自动关闭没有监听器的连接
        // disconnectGlobalWs(instance);
      }
    };
  }, [
    url,
    onMessage,
    statusHandler,
    autoConnect,
    maxReconnectAttempts,
    reconnectInterval,
    heartbeatInterval,
  ]);

  // 包装方法
  const connect = useCallback(() => {
    const instance = getGlobalWsInstance(url);
    connectGlobalWs(instance, url, {
      maxReconnectAttempts,
      reconnectInterval,
      heartbeatInterval,
    });
  }, [url, maxReconnectAttempts, reconnectInterval, heartbeatInterval]);

  const disconnect = useCallback(() => {
    const instance = getGlobalWsInstance(url);
    disconnectGlobalWs(instance);
  }, [url]);

  const sendMessage = useCallback(
    (message: any) => {
      const instance = getGlobalWsInstance(url);
      return sendGlobalMessage(instance, message);
    },
    [url],
  );

  const reconnect = useCallback(() => {
    const instance = getGlobalWsInstance(url);
    reconnectGlobalWs(instance, url, {
      maxReconnectAttempts,
      reconnectInterval,
      heartbeatInterval,
    });
  }, [url, maxReconnectAttempts, reconnectInterval, heartbeatInterval]);

  return {
    status,
    connect,
    disconnect,
    sendMessage,
    reconnect,
    isConnected: wsInstance.connected,
  };
}

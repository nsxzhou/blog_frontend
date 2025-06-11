import { getTokenFromStorage } from '@/utils/auth';
import { useCallback, useEffect, useRef, useState } from 'react';

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

  const [status, setStatus] = useState<WebSocketStatus>({
    status: 'disconnected',
    message: '未连接',
  });

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isManualCloseRef = useRef(false);

  // 更新状态
  const updateStatus = useCallback(
    (newStatus: WebSocketStatus['status'], message: string) => {
      const statusObj: WebSocketStatus = {
        status: newStatus,
        message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setStatus(statusObj);
      onStatusChange?.(statusObj);
    },
    [onStatusChange],
  );

  // 清理定时器
  const clearTimers = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  // 启动心跳
  const startHeartbeat = useCallback(() => {
    clearInterval(heartbeatTimerRef.current!);
    heartbeatTimerRef.current = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: 'ping', timestamp: Date.now() }),
        );
      }
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  // 连接WebSocket
  const connect = useCallback(async () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const token = getTokenFromStorage();
      if (!token) {
        updateStatus('error', '未找到认证token，请先登录');
        return;
      }

      updateStatus('connecting', '正在连接...');
      isManualCloseRef.current = false;

      // 构建WebSocket URL
      const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      // 连接打开
      socket.onopen = () => {
        updateStatus('connected', '连接成功');
        reconnectAttemptsRef.current = 0;
        startHeartbeat();
      };

      // 接收消息
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
        }
      };

      // 连接关闭
      socket.onclose = (event) => {
        console.log('WebSocket连接关闭:', event);
        clearTimers();
        socketRef.current = null;

        if (isManualCloseRef.current) {
          updateStatus('disconnected', '已断开连接');
        } else {
          updateStatus('disconnected', `连接已关闭 (${event.code})`);
          // 自动重连
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            scheduleReconnect();
          } else {
            updateStatus('error', '连接失败，已达到最大重试次数');
          }
        }
      };

      // 连接错误
      socket.onerror = () => {
        updateStatus('error', '连接错误');
      };

      // 连接超时
      setTimeout(() => {
        if (socket.readyState === WebSocket.CONNECTING) {
          socket.close();
          updateStatus('error', '连接超时');
        }
      }, 10000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '连接失败';
      updateStatus('error', errorMessage);
    }
  }, [url, onMessage, updateStatus, maxReconnectAttempts, startHeartbeat]);

  // 计划重连
  const scheduleReconnect = useCallback(() => {
    reconnectAttemptsRef.current++;
    const delay =
      reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1);

    updateStatus(
      'reconnecting',
      `重连中... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
    );

    reconnectTimerRef.current = setTimeout(() => {
      connect();
    }, Math.min(delay, 30000)); // 最大延迟30秒
  }, [connect, reconnectInterval, maxReconnectAttempts, updateStatus]);

  // 断开连接
  const disconnect = useCallback(() => {
    isManualCloseRef.current = true;
    clearTimers();
    if (socketRef.current) {
      socketRef.current.close(1000, '用户主动断开');
    }
  }, [clearTimers]);

  // 发送消息
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const messageStr =
        typeof message === 'string' ? message : JSON.stringify(message);
      socketRef.current.send(messageStr);
      return true;
    }
    return false;
  }, []);

  // 重连
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  // 自动连接
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      isManualCloseRef.current = true;
      clearTimers();
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [autoConnect, connect, clearTimers]);

  return {
    status,
    connect,
    disconnect,
    sendMessage,
    reconnect,
    isConnected: status.status === 'connected',
  };
}

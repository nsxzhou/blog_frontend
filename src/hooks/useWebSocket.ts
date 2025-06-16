import {
  useWebSocketStore,
  type MessageHandler,
  type NotificationMessage,
} from '@/stores/websocketStore';
import { useEffect } from 'react';

/**
 * 简洁的WebSocket Hook
 * 自动管理连接和消息处理
 */
export function useWebSocket(messageHandler?: MessageHandler) {
  const {
    status,
    statusMessage,
    connect,
    disconnect,
    addMessageHandler,
    removeMessageHandler,
    isConnected,
  } = useWebSocketStore();

  // 自动连接和注册消息处理器
  useEffect(() => {
    // 自动连接
    if (status === 'disconnected') {
      connect();
    }

    // 注册消息处理器
    if (messageHandler) {
      addMessageHandler(messageHandler);
    }

    // 清理函数
    return () => {
      if (messageHandler) {
        removeMessageHandler(messageHandler);
      }
    };
  }, [
    messageHandler,
    status,
    connect,
    addMessageHandler,
    removeMessageHandler,
  ]);

  return {
    status,
    statusMessage,
    isConnected: isConnected(),
    connect,
    disconnect,
  };
}

// 导出类型
export type { MessageHandler, NotificationMessage };

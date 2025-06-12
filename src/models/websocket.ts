import { getTokenFromStorage } from '@/utils/auth';

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

interface WebSocketInstance {
  socket: WebSocket | null;
  status: WebSocketStatus;
  reconnectAttempts: number;
  isManualClose: boolean;
  connected: boolean;
}

export interface WebSocketState {
  connections: Record<string, WebSocketInstance>;
  messageCallbacks: Record<string, Set<(message: WebSocketMessage) => void>>;
  statusCallbacks: Record<string, Set<(status: WebSocketStatus) => void>>;
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

const initialState: WebSocketState = {
  connections: {},
  messageCallbacks: {},
  statusCallbacks: {},
};

export default {
  namespace: 'websocket',

  state: initialState,

  effects: {
    *connect(
      { payload }: { payload: any },
      { put, select }: any,
    ): Generator<any, void, any> {
      const { url, options } = payload;
      const { maxReconnectAttempts = 5, reconnectInterval = 3000 } = options;

      // 检查连接是否存在
      const connection = yield select(
        (state: any) => state.websocket.connections[url],
      );
      if (connection?.socket?.readyState === WebSocket.OPEN) {
        return;
      }

      try {
        const token = getTokenFromStorage();
        if (!token) {
          yield put({
            type: 'updateStatus',
            payload: {
              url,
              status: {
                status: 'error',
                message: '未找到认证token，请先登录',
                timestamp: new Date().toLocaleTimeString(),
              },
            },
          });
          return;
        }

        // 更新状态为连接中
        yield put({
          type: 'updateStatus',
          payload: {
            url,
            status: {
              status: 'connecting',
              message: '正在连接...',
              timestamp: new Date().toLocaleTimeString(),
            },
          },
        });

        // 设置为非手动关闭
        yield put({
          type: 'updateConnection',
          payload: { url, isManualClose: false },
        });

        // 创建WebSocket连接
        const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
        const socket = new WebSocket(wsUrl);

        // 更新socket实例
        yield put({
          type: 'updateConnection',
          payload: { url, socket },
        });

        // 设置事件处理
        setupSocketEvents(socket, url, put, {
          maxReconnectAttempts,
          reconnectInterval,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '连接失败';
        yield put({
          type: 'updateStatus',
          payload: {
            url,
            status: {
              status: 'error',
              message: errorMessage,
              timestamp: new Date().toLocaleTimeString(),
            },
          },
        });
      }
    },

    *disconnect(
      { payload }: { payload: any },
      { put, select }: any,
    ): Generator<any, void, any> {
      const { url } = payload;

      const connection = yield select(
        (state: any) => state.websocket.connections[url],
      );
      if (connection?.socket) {
        // 标记为手动关闭
        yield put({
          type: 'updateConnection',
          payload: { url, isManualClose: true },
        });

        // 关闭连接
        connection.socket.close(1000, '用户主动断开');
      }
    },

    *reconnect(
      { payload }: { payload: any },
      { put }: any,
    ): Generator<any, void, any> {
      const { url, options } = payload;

      yield put({
        type: 'updateConnection',
        payload: { url, reconnectAttempts: 0 },
      });

      yield put({
        type: 'connect',
        payload: { url, options },
      });
    },

    *sendMessage(
      { payload }: { payload: any },
      { select }: any,
    ): Generator<any, boolean, any> {
      const { url, message } = payload;

      const connection = yield select(
        (state: any) => state.websocket.connections[url],
      );
      if (connection?.socket?.readyState === WebSocket.OPEN) {
        const messageStr =
          typeof message === 'string' ? message : JSON.stringify(message);
        connection.socket.send(messageStr);
        return true;
      }

      return false;
    },

    *handleMessage(
      { payload }: { payload: any },
      { select }: any,
    ): Generator<any, void, any> {
      const { url, message } = payload;

      const callbacks = yield select(
        (state: any) => state.websocket.messageCallbacks[url],
      );
      if (callbacks) {
        callbacks.forEach((callback: (message: WebSocketMessage) => void) => {
          try {
            callback(message);
          } catch (error) {
            console.error('消息处理器错误:', error);
          }
        });
      }
    },
  },

  reducers: {
    // 初始化连接
    initConnection(state: WebSocketState, { payload }: { payload: any }) {
      const { url } = payload;

      if (state.connections[url]) {
        return state;
      }

      return {
        ...state,
        connections: {
          ...state.connections,
          [url]: {
            socket: null,
            status: { status: 'disconnected', message: '未连接' },
            reconnectAttempts: 0,
            isManualClose: false,
            connected: false,
          },
        },
        messageCallbacks: {
          ...state.messageCallbacks,
          [url]: new Set(),
        },
        statusCallbacks: {
          ...state.statusCallbacks,
          [url]: new Set(),
        },
      };
    },

    // 更新连接
    updateConnection(state: WebSocketState, { payload }: { payload: any }) {
      const { url, ...updates } = payload;

      // 如果连接不存在，先初始化
      if (!state.connections[url]) {
        return this.initConnection(state, { payload: { url } });
      }

      return {
        ...state,
        connections: {
          ...state.connections,
          [url]: {
            ...state.connections[url],
            ...updates,
          },
        },
      };
    },

    // 更新状态
    updateStatus(state: WebSocketState, { payload }: { payload: any }) {
      const { url, status } = payload;

      // 如果连接不存在，先初始化
      if (!state.connections[url]) {
        state = this.initConnection(state, { payload: { url } });
      }

      // 设置连接状态
      const connected = status.status === 'connected';

      // 通知状态回调
      if (state.statusCallbacks[url]) {
        state.statusCallbacks[url].forEach((callback) => {
          try {
            callback(status);
          } catch (error) {
            console.error('状态回调错误:', error);
          }
        });
      }

      return {
        ...state,
        connections: {
          ...state.connections,
          [url]: {
            ...state.connections[url],
            status,
            connected,
          },
        },
      };
    },

    // 添加消息回调
    addMessageCallback(state: WebSocketState, { payload }: { payload: any }) {
      const { url, callback } = payload;

      // 如果连接不存在，先初始化
      if (!state.messageCallbacks[url]) {
        state = this.initConnection(state, { payload: { url } });
      }

      const callbacks = new Set(state.messageCallbacks[url]);
      callbacks.add(callback);

      return {
        ...state,
        messageCallbacks: {
          ...state.messageCallbacks,
          [url]: callbacks,
        },
      };
    },

    // 移除消息回调
    removeMessageCallback(
      state: WebSocketState,
      { payload }: { payload: any },
    ) {
      const { url, callback } = payload;

      if (!state.messageCallbacks[url]) {
        return state;
      }

      const callbacks = new Set(state.messageCallbacks[url]);
      callbacks.delete(callback);

      return {
        ...state,
        messageCallbacks: {
          ...state.messageCallbacks,
          [url]: callbacks,
        },
      };
    },

    // 添加状态回调
    addStatusCallback(state: WebSocketState, { payload }: { payload: any }) {
      const { url, callback } = payload;

      // 如果连接不存在，先初始化
      if (!state.statusCallbacks[url]) {
        state = this.initConnection(state, { payload: { url } });
      }

      const callbacks = new Set(state.statusCallbacks[url]);
      callbacks.add(callback);

      return {
        ...state,
        statusCallbacks: {
          ...state.statusCallbacks,
          [url]: callbacks,
        },
      };
    },

    // 移除状态回调
    removeStatusCallback(state: WebSocketState, { payload }: { payload: any }) {
      const { url, callback } = payload;

      if (!state.statusCallbacks[url]) {
        return state;
      }

      const callbacks = new Set(state.statusCallbacks[url]);
      callbacks.delete(callback);

      return {
        ...state,
        statusCallbacks: {
          ...state.statusCallbacks,
          [url]: callbacks,
        },
      };
    },
  },
};

// 辅助函数：设置WebSocket事件
function setupSocketEvents(
  socket: WebSocket,
  url: string,
  put: any,
  options: any,
) {
  const { maxReconnectAttempts, reconnectInterval } = options;

  // 连接打开
  socket.onopen = () => {
    put({
      type: 'updateStatus',
      payload: {
        url,
        status: {
          status: 'connected',
          message: '连接成功',
          timestamp: new Date().toLocaleTimeString(),
        },
      },
    });

    put({
      type: 'updateConnection',
      payload: { url, reconnectAttempts: 0 },
    });
  };

  // 接收消息
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      put({ type: 'handleMessage', payload: { url, message } });
    } catch (error) {
      console.error('解析WebSocket消息失败:', error);
    }
  };

  // 连接关闭
  socket.onclose = (event) => {
    put({
      type: 'updateConnection',
      payload: { url, socket: null },
    });

    put({
      type: 'select',
      payload: (state: any) => {
        const connection = state.websocket.connections[url];

        if (connection?.isManualClose) {
          put({
            type: 'updateStatus',
            payload: {
              url,
              status: {
                status: 'disconnected',
                message: '已断开连接',
                timestamp: new Date().toLocaleTimeString(),
              },
            },
          });
        } else {
          put({
            type: 'updateStatus',
            payload: {
              url,
              status: {
                status: 'disconnected',
                message: `连接已关闭 (${event.code})`,
                timestamp: new Date().toLocaleTimeString(),
              },
            },
          });

          // 尝试重连
          if (
            connection &&
            connection.reconnectAttempts < maxReconnectAttempts
          ) {
            const newAttempts = connection.reconnectAttempts + 1;

            put({
              type: 'updateStatus',
              payload: {
                url,
                status: {
                  status: 'reconnecting',
                  message: `重连中... (${newAttempts}/${maxReconnectAttempts})`,
                  timestamp: new Date().toLocaleTimeString(),
                },
              },
            });

            put({
              type: 'updateConnection',
              payload: { url, reconnectAttempts: newAttempts },
            });

            // 延迟重连
            const delay = reconnectInterval * Math.pow(2, newAttempts - 1);
            const cappedDelay = Math.min(delay, 30000); // 最大延迟30秒

            setTimeout(() => {
              put({
                type: 'connect',
                payload: {
                  url,
                  options: { maxReconnectAttempts, reconnectInterval },
                },
              });
            }, cappedDelay);
          } else {
            put({
              type: 'updateStatus',
              payload: {
                url,
                status: {
                  status: 'error',
                  message: '连接失败，已达到最大重试次数',
                  timestamp: new Date().toLocaleTimeString(),
                },
              },
            });
          }
        }
      },
    });
  };

  // 连接错误
  socket.onerror = () => {
    put({
      type: 'updateStatus',
      payload: {
        url,
        status: {
          status: 'error',
          message: '连接错误',
          timestamp: new Date().toLocaleTimeString(),
        },
      },
    });
  };

  // 连接超时
  setTimeout(() => {
    if (socket.readyState === WebSocket.CONNECTING) {
      socket.close();
      put({
        type: 'updateStatus',
        payload: {
          url,
          status: {
            status: 'error',
            message: '连接超时',
            timestamp: new Date().toLocaleTimeString(),
          },
        },
      });
    }
  }, 10000);
}

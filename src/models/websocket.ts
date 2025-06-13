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

// 提取出来的初始化连接函数
const initConnectionFunc = (
  state: WebSocketState,
  url: string,
): WebSocketState => {
  if (state.connections[url]) {
    return state;
  }

  // 创建新的状态对象，确保类型正确
  const newState: WebSocketState = {
    ...state,
    connections: {
      ...state.connections,
    },
    messageCallbacks: {
      ...state.messageCallbacks,
    },
    statusCallbacks: {
      ...state.statusCallbacks,
    },
  };

  // 添加新的连接
  newState.connections[url] = {
    socket: null,
    status: {
      status: 'disconnected',
      message: '未连接',
    },
    reconnectAttempts: 0,
    isManualClose: false,
    connected: false,
  };

  // 添加回调集合
  newState.messageCallbacks[url] = new Set<
    (message: WebSocketMessage) => void
  >();
  newState.statusCallbacks[url] = new Set<(status: WebSocketStatus) => void>();

  return newState;
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
      const { maxReconnectAttempts = 5, reconnectInterval = 3000 } =
        options || {};

      console.log(
        '%c[WebSocket] connect被调用',
        'color: #4CAF50; font-weight: bold;',
        { url, options },
      );

      // 检查连接是否存在
      const connection = yield select(
        (state: any) => state.websocket.connections[url],
      );

      // 增强连接状态检查，避免重复连接
      if (connection) {
        // 如果已经连接中或正在连接中，则跳过
        if (connection.socket?.readyState === WebSocket.OPEN) {
          console.log('%c[WebSocket] 已连接，跳过', 'color: #4CAF50');
          return;
        }

        // 正在连接中，跳过
        if (connection.socket?.readyState === WebSocket.CONNECTING) {
          console.log('%c[WebSocket] 正在连接中，跳过', 'color: #4CAF50');
          return;
        }

        // 如果在重连过程中，跳过
        if (connection.status.status === 'reconnecting') {
          console.log('%c[WebSocket] 正在重连中，跳过', 'color: #FF9800');
          return;
        }
      }

      try {
        const token = getTokenFromStorage();
        if (!token) {
          console.error(
            '%c[WebSocket] 连接失败：未找到认证token',
            'color: #F44336; font-weight: bold',
          );
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

        console.log(
          '%c[WebSocket] 开始连接...',
          'color: #2196F3; font-weight: bold',
        );

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
        console.log('%c[WebSocket] 创建WebSocket实例', 'color: #2196F3');

        try {
          const socket = new WebSocket(wsUrl);
          console.log(wsUrl);

          console.log('%c[WebSocket] WebSocket实例创建成功', 'color: #4CAF50');

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

          console.log(
            '%c[WebSocket] 连接已初始化，等待连接结果...',
            'color: #2196F3',
          );
        } catch (wsError) {
          console.error(
            '%c[WebSocket] 创建WebSocket实例失败:',
            'color: #F44336; font-weight: bold',
            wsError,
          );
          throw wsError;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '连接失败';
        console.error(
          '%c[WebSocket] 连接错误:',
          'color: #F44336; font-weight: bold',
          errorMessage,
          error,
        );
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
        console.log('%c[WebSocket] 手动断开连接', 'color: #FF9800');

        // 标记为手动关闭
        yield put({
          type: 'updateConnection',
          payload: { url, isManualClose: true },
        });

        // 更新状态为断开连接中
        yield put({
          type: 'updateStatus',
          payload: {
            url,
            status: {
              status: 'disconnected',
              message: '正在断开连接...',
              timestamp: new Date().toLocaleTimeString(),
            },
          },
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
      return initConnectionFunc(state, url);
    },

    // 更新连接
    updateConnection(state: WebSocketState, { payload }: { payload: any }) {
      const { url, ...updates } = payload;

      // 如果连接不存在，先初始化
      if (!state.connections[url]) {
        return initConnectionFunc(state, url);
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
        state = initConnectionFunc(state, url);
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
    console.log(
      '%c[WebSocket] 连接成功!',
      'color: #4CAF50; font-weight: bold;',
      url,
    );
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
      console.log('%c[WebSocket] 收到消息:', 'color: #2196F3', message);
      put({ type: 'handleMessage', payload: { url, message } });
    } catch (error) {
      console.error(
        '%c[WebSocket] 解析消息失败:',
        'color: #F44336',
        error,
        event.data,
      );
    }
  };

  // 连接关闭
  socket.onclose = (event) => {
    console.log('%c[WebSocket] 连接关闭:', 'color: #FF9800', {
      code: event.code,
      reason: event.reason,
    });
    put({
      type: 'updateConnection',
      payload: { url, socket: null },
    });

    put({
      type: 'select',
      payload: (state: any) => {
        const connection = state.websocket.connections[url];

        if (connection?.isManualClose) {
          console.log('%c[WebSocket] 手动关闭连接', 'color: #FF9800');
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
          console.log('%c[WebSocket] 非手动关闭，准备重连', 'color: #FF9800');
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

          // 增加判断，避免在特定情况下不必要的重连
          // 1000: 正常关闭
          // 1001: 端点离开 (例如服务器关闭或离开页面)
          // 1005: 无状态码收到
          const isCleanClosure =
            event.code === 1000 || event.code === 1001 || event.code === 1005;

          // 如果是干净的关闭并且消息表明是被新连接替换，不重连
          if (
            isCleanClosure &&
            event.reason?.includes('replaced by new connection')
          ) {
            console.log(
              '%c[WebSocket] 连接被新连接替换，不进行重连',
              'color: #FF9800; font-weight: bold;',
            );
            return;
          }

          // 尝试重连
          if (
            connection &&
            connection.reconnectAttempts < maxReconnectAttempts
          ) {
            const newAttempts = connection.reconnectAttempts + 1;
            console.log(
              '%c[WebSocket] 开始第' + newAttempts + '次重连尝试',
              'color: #FF9800; font-weight: bold;',
            );

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
            console.log(
              '%c[WebSocket] 将在' + cappedDelay + 'ms后尝试重连',
              'color: #FF9800',
            );

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
            console.log(
              '%c[WebSocket] 达到最大重连次数，停止重连',
              'color: #F44336; font-weight: bold;',
            );
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
  socket.onerror = (event) => {
    console.error(
      '%c[WebSocket] 连接错误!',
      'color: #F44336; font-weight: bold;',
      event,
    );
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
      console.log('%c[WebSocket] 连接超时，关闭连接', 'color: #F44336');
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

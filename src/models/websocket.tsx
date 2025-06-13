import type { Reducer } from '@umijs/max';

export interface WebSocketState {
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  statusMessage: string;
  socket: WebSocket | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectInterval: number;
}

export interface WebSocketModelType {
  namespace: 'websocket';
  state: WebSocketState;
  reducers: {
    setStatus: Reducer<WebSocketState>;
    setSocket: Reducer<WebSocketState>;
    incrementReconnectAttempts: Reducer<WebSocketState>;
    resetReconnectAttempts: Reducer<WebSocketState>;
  };
}

const WebSocketModel: WebSocketModelType = {
  namespace: 'websocket',
  state: {
    status: 'disconnected',
    statusMessage: '未连接',
    socket: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectInterval: 3000,
  },
  reducers: {
    setStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        statusMessage: payload.message,
      };
    },
    setSocket(state, { payload }) {
      return {
        ...state,
        socket: payload,
      };
    },
    incrementReconnectAttempts(state) {
      return {
        ...state,
        reconnectAttempts: state.reconnectAttempts + 1,
      };
    },
    resetReconnectAttempts(state) {
      return {
        ...state,
        reconnectAttempts: 0,
      };
    },
  },
};

export default WebSocketModel;

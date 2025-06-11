import { Button } from '@/components/ui';
import { fadeInUp } from '@/constants/animations';
import { useWebSocket } from '@/hooks/useWebSocket';
import useNotificationModel from '@/models/notification';
import { getTokenFromStorage } from '@/utils/auth';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import { Helmet } from '@umijs/max';
import { Card, Input, message, Typography } from 'antd';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  timestamp: string;
}

const TestPage: FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [customMessage, setCustomMessage] = useState('');

  // 使用通知模型
  const notificationModel = useNotificationModel();

  // 添加日志
  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const logEntry: LogEntry = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [logEntry, ...prev].slice(0, 100)); // 保留最近100条日志
  }, []);

  // WebSocket消息处理
  const handleWebSocketMessage = useCallback(
    (wsMessage: any) => {
      addLog('info', `收到消息: ${JSON.stringify(wsMessage)}`);
    },
    [addLog],
  );

  // WebSocket状态变化处理
  const handleStatusChange = useCallback(
    (status: any) => {
      addLog('info', `连接状态变化: ${status.message}`);
    },
    [addLog],
  );

  // 独立的WebSocket连接（用于测试）
  const {
    status: wsStatus,
    connect,
    disconnect,
    sendMessage,
    reconnect,
    isConnected,
  } = useWebSocket({
    url: 'ws://127.0.0.1:8080/api/ws/connect',
    onMessage: handleWebSocketMessage,
    onStatusChange: handleStatusChange,
    autoConnect: false, // 手动控制连接
  });

  // 发送自定义消息
  const handleSendCustomMessage = useCallback(() => {
    if (!customMessage.trim()) {
      message.warning('请输入消息内容');
      return;
    }

    try {
      const messageObj = JSON.parse(customMessage);
      const success = sendMessage(messageObj);
      if (success) {
        addLog('success', `发送消息: ${customMessage}`);
        setCustomMessage('');
      } else {
        addLog('error', 'WebSocket未连接，发送失败');
      }
    } catch (error) {
      // 如果不是JSON格式，直接发送字符串
      const success = sendMessage(customMessage);
      if (success) {
        addLog('success', `发送消息: ${customMessage}`);
        setCustomMessage('');
      } else {
        addLog('error', 'WebSocket未连接，发送失败');
      }
    }
  }, [customMessage, sendMessage, addLog]);

  // 发送预设消息
  const sendPresetMessage = useCallback(
    (type: string) => {
      const messages = {
        ping: { type: 'ping', timestamp: Date.now() },
        test: {
          type: 'test',
          message: 'Hello from test page',
          timestamp: Date.now(),
        },
        notification: {
          type: 'notification_test',
          data: {
            title: '测试通知',
            content: '这是一条测试通知消息',
            type: 'system',
          },
          timestamp: Date.now(),
        },
      };

      const messageObj = messages[type as keyof typeof messages];
      const success = sendMessage(messageObj);

      if (success) {
        addLog('success', `发送${type}消息: ${JSON.stringify(messageObj)}`);
      } else {
        addLog('error', 'WebSocket未连接，发送失败');
      }
    },
    [sendMessage, addLog],
  );

  // 清空日志
  const clearLogs = useCallback(() => {
    setLogs([]);
    addLog('info', '日志已清空');
  }, [addLog]);

  // 测试浏览器通知
  const testBrowserNotification = useCallback(async () => {
    const hasPermission =
      await notificationModel.requestNotificationPermission();
    if (hasPermission) {
      notificationModel.showBrowserNotification(
        '测试通知',
        '这是一条来自博客系统的测试通知',
        '/favicon.ico',
      );
      addLog('success', '浏览器通知发送成功');
    } else {
      addLog('error', '浏览器通知权限被拒绝');
    }
  }, [notificationModel, addLog]);

  // 获取状态图标
  const getStatusIcon = () => {
    switch (wsStatus.status) {
      case 'connected':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'connecting':
      case 'reconnecting':
        return <LoadingOutlined className="text-blue-500" />;
      case 'error':
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return <WifiOutlined className="text-gray-400" />;
    }
  };

  // 获取状态颜色
  const getStatusColor = () => {
    switch (wsStatus.status) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
      case 'reconnecting':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // 获取日志颜色
  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <Helmet>
        <title>WebSocket连接测试 - 博客系统</title>
      </Helmet>

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container mx-auto p-8 max-w-7xl"
      >
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <WifiOutlined className="text-2xl text-blue-600" />
            <Title level={2} className="!mb-0">
              WebSocket连接测试
            </Title>
          </div>
          <Paragraph className="text-gray-600">
            测试与ES服务器的WebSocket连接，地址:
            ws://127.0.0.1:8080/api/ws/connect
          </Paragraph>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 连接控制面板 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card title="连接控制" className="h-fit">
              {/* 连接状态 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon()}
                  <Text strong className={getStatusColor()}>
                    {wsStatus.message}
                  </Text>
                </div>
                {wsStatus.timestamp && (
                  <Text type="secondary" className="text-sm">
                    更新时间: {wsStatus.timestamp}
                  </Text>
                )}
              </div>

              {/* 控制按钮 */}
              <div className="space-y-3">
                <Button
                  onClick={connect}
                  disabled={isConnected}
                  className="w-full"
                >
                  {wsStatus.status === 'connecting'
                    ? '连接中...'
                    : '连接WebSocket'}
                </Button>

                <Button
                  onClick={disconnect}
                  disabled={!isConnected}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  断开连接
                </Button>

                <Button onClick={reconnect} className="w-full border-dashed">
                  重新连接
                </Button>
              </div>

              {/* 预设消息 */}
              <div className="mt-6">
                <Text strong className="block mb-3">
                  快速测试:
                </Text>
                <div className="space-y-2">
                  <Button
                    onClick={() => sendPresetMessage('ping')}
                    disabled={!isConnected}
                    className="w-full"
                    size="sm"
                  >
                    发送Ping消息
                  </Button>
                  <Button
                    onClick={() => sendPresetMessage('test')}
                    disabled={!isConnected}
                    className="w-full"
                    size="sm"
                  >
                    发送测试消息
                  </Button>
                  <Button
                    onClick={() => sendPresetMessage('notification')}
                    disabled={!isConnected}
                    className="w-full"
                    size="sm"
                  >
                    发送通知测试
                  </Button>
                  <Button
                    onClick={testBrowserNotification}
                    className="w-full border-dashed"
                    size="sm"
                  >
                    测试浏览器通知
                  </Button>
                </div>
              </div>

              {/* 连接信息 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <Text strong className="block mb-2">
                  连接信息:
                </Text>
                <div className="space-y-1 text-sm">
                  <div>地址: ws://127.0.0.1:8080/api/ws/connect</div>
                  <div>认证: Token (Query参数)</div>
                  <div>
                    状态:{' '}
                    <span className={getStatusColor()}>{wsStatus.status}</span>
                  </div>
                  <div>
                    Token: {getTokenFromStorage() ? '已获取' : '未获取'}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 消息发送和日志面板 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* 自定义消息 */}
            <Card title="自定义消息">
              <div className="space-y-3">
                <TextArea
                  placeholder='输入JSON格式的消息，如: {"type": "test", "message": "hello"}'
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={handleSendCustomMessage}
                  disabled={!isConnected}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  发送自定义消息
                </Button>
              </div>
            </Card>

            {/* 通知系统状态 */}
            <Card title="通知系统状态">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>WebSocket状态:</span>
                  <span
                    className={
                      notificationModel.isConnected
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {notificationModel.isConnected ? '已连接' : '未连接'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>未读通知:</span>
                  <span className="text-blue-600">
                    {notificationModel.state.unreadCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>总通知:</span>
                  <span className="text-gray-600">
                    {notificationModel.state.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>浏览器通知权限:</span>
                  <span
                    className={
                      Notification.permission === 'granted'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {Notification.permission}
                  </span>
                </div>
              </div>
            </Card>

            {/* 日志面板 */}
            <Card
              title="连接日志"
              extra={
                <Button size="sm" onClick={clearLogs}>
                  清空日志
                </Button>
              }
            >
              <div className="max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    暂无日志记录
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 p-2 rounded bg-gray-50 text-sm"
                      >
                        <Text type="secondary" className="text-xs min-w-fit">
                          {log.timestamp}
                        </Text>
                        <Text className={getLogColor(log.type)}>
                          {log.message}
                        </Text>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 使用说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card title="功能说明">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <Text strong className="block mb-2">
                  WebSocket测试:
                </Text>
                <ul className="space-y-1 text-gray-600">
                  <li>• 测试与ES服务器的实时连接</li>
                  <li>• 支持自动重连和错误处理</li>
                  <li>• 心跳机制保持连接活跃</li>
                  <li>• 支持自定义消息发送</li>
                </ul>
              </div>
              <div>
                <Text strong className="block mb-2">
                  通知系统测试:
                </Text>
                <ul className="space-y-1 text-gray-600">
                  <li>• 测试实时通知接收</li>
                  <li>• 浏览器原生通知权限管理</li>
                  <li>• 跨标签页状态同步</li>
                  <li>• 通知状态实时更新</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TestPage;

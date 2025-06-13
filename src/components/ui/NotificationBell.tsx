import { Button, UserAvatar } from '@/components/ui';
import { fadeInUp, scaleIn } from '@/constants/animations';
import {
  BellOutlined,
  CheckOutlined,
  LoginOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect, useNavigate } from '@umijs/max';
import { Badge, Empty, List, Popover, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useCallback, useRef, useState } from 'react';

const { Text, Title } = Typography;

interface NotificationBellProps {
  className?: string;
  notification?: any;
  dispatch?: any;
  currentUser?: any;
}

const NotificationBell: FC<NotificationBellProps> = ({
  className = '',
  notification,
  dispatch,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  // 从props中获取状态
  const state = notification;
  const isConnected = notification.isConnected;
  const connectionStatus = notification.connectionStatus;


  // 处理通知点击
  const handleNotificationClick = useCallback(
    (notification: any) => {
      // 标记为已读
      if (!notification.is_read) {
        dispatch({ type: 'notification/markAsRead', payload: notification.id });
      }

      // 跳转到相关页面
      if (notification.article) {
        navigate(`/article-detail/${notification.article.id}`);
      }

      setVisible(false);
    },
    [dispatch, navigate],
  );

  // 查看所有通知
  const handleViewAll = useCallback(() => {
    navigate('/notifications');
    setVisible(false);
  }, [navigate]);

  // 跳转到登录页面
  const handleGoToLogin = useCallback(() => {
    navigate('/login');
    setVisible(false);
  }, [navigate]);

  // 刷新通知
  const refreshNotifications = useCallback(() => {
    dispatch({ type: 'notification/refreshNotifications' });
  }, [dispatch]);

  // 标记所有已读
  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'notification/markAllAsRead' });
  }, [dispatch]);

  // 格式化通知时间
  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      return '刚刚';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    } else {
      return `${Math.floor(diff / 86400000)}天前`;
    }
  }, []);

  // 未登录状态的内容
  const notLoggedInContent = (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className="w-80 p-4"
    >
      <div className="flex flex-col items-center justify-center py-6">
        <BellOutlined className="text-4xl text-gray-300 mb-4" />
        <Title level={5} className="text-center mb-2">
          请先登录
        </Title>
        <Text type="secondary" className="text-center mb-4">
          登录后查看您的通知
        </Text>
        <Button
          size="sm"
          onClick={handleGoToLogin}
          className="px-8 py-1.5 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <LoginOutlined className="mr-1" />
          去登录
        </Button>
      </div>
    </motion.div>
  );

  // 通知弹窗内容
  const notificationContent = (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className="w-96 max-h-[450px]"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <BellOutlined className="text-blue-500 text-lg" />
          <Title level={5} className="!mb-0">
            通知
          </Title>
          <Badge count={state.unreadCount} size="small" className="ml-1" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshNotifications}
            className="p-2 hover:text-blue-500"
          >
            <ReloadOutlined className="text-sm" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleViewAll}
            className="p-2 hover:text-blue-500"
          >
            <SettingOutlined className="text-sm" />
          </Button>
        </div>
      </div>

      {/* 连接状态 */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <Text type="secondary">{connectionStatus}</Text>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="max-h-[300px] overflow-y-auto">
        {state.loading ? (
          <div className="flex justify-center py-8">
            <Spin size="small" />
          </div>
        ) : state.notifications.length === 0 ? (
          <div className="py-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无通知"
              className="text-sm"
            />
          </div>
        ) : (
          <List
            dataSource={state.notifications.slice(0, 10)}
            renderItem={(notification: any) => (
              <motion.div
                key={notification.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                whileHover={{
                  backgroundColor: '#f0f9ff',
                  transition: { duration: 0.1 },
                }}
                className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-all ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  {/* 使用UserAvatar组件替代原来的头像实现 */}
                  <UserAvatar
                    user={notification.sender}
                    size="sm"
                    className={
                      !notification.is_read
                        ? 'ring-2 ring-blue-300 ring-offset-1'
                        : ''
                    }
                    fallback={notification.sender?.nickname?.[0] || 'N'}
                  />

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1.5">
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      )}
                      <Text
                        className={`text-sm ${
                          !notification.is_read
                            ? 'font-medium text-black'
                            : 'text-gray-700'
                        }`}
                      >
                        {notification.content}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center">
                      <Text type="secondary" className="text-xs">
                        {formatTime(notification.created_at)}
                      </Text>
                      {notification.article && (
                        <Text
                          type="secondary"
                          className="text-xs truncate max-w-[180px]"
                        >
                          《{notification.article.title}》
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          />
        )}
      </div>

      {/* 底部操作 */}
      {state.notifications.length > 0 && (
        <div className="border-t border-gray-200 p-2 flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllAsRead}
            className="flex-1 py-1.5"
            disabled={state.unreadCount === 0}
          >
            <CheckOutlined className="mr-1" />
            全部已读
          </Button>
          <Button
            size="sm"
            onClick={handleViewAll}
            className="flex-1 py-1.5 bg-blue-500 hover:bg-blue-600 text-white"
          >
            查看全部
          </Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <Popover
      content={currentUser ? notificationContent : notLoggedInContent}
      trigger="click"
      placement="bottomRight"
      overlayClassName="notification-popover"
      open={visible}
      onOpenChange={setVisible}
      arrow={false}
      getPopupContainer={() => buttonContainerRef.current || document.body}
      forceRender
    >
      <div ref={buttonContainerRef} className="inline-block">
        <Button
          variant="ghost"
          className={`relative p-2 rounded-lg hover:bg-gray-100 ${className}`}
          onClick={() => setVisible(!visible)}
        >
          <Badge
            count={currentUser ? state.unreadCount : 0}
            size="small"
            offset={[-2, 2]}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-6 h-6"
            >
              <BellOutlined className="text-lg" />
            </motion.div>
          </Badge>
        </Button>
      </div>
    </Popover>
  );
};

export default connect(
  ({ notification, user }: { notification: any; user: any }) => ({
    notification,
    currentUser: user.currentUser,
  }),
)(NotificationBell);

import { Button } from '@/components/ui';
import { fadeInUp } from '@/constants/animations';
import useNotificationModel from '@/models/notification';
import {
  BellOutlined,
  CheckOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Badge, Empty, List, Popover, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

const { Text, Title } = Typography;

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: FC<NotificationBellProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const {
    state,
    isConnected,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotificationModel();

  // 处理通知点击
  const handleNotificationClick = useCallback(
    (notification: any) => {
      // 标记为已读
      if (!notification.is_read) {
        markAsRead(notification.id);
      }

      // 跳转到相关页面
      if (notification.article) {
        navigate(`/article-detail/${notification.article.id}`);
      }

      setVisible(false);
    },
    [markAsRead, navigate],
  );

  // 查看所有通知
  const handleViewAll = useCallback(() => {
    navigate('/notifications');
    setVisible(false);
  }, [navigate]);

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

  // 通知弹窗内容
  const notificationContent = (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="w-80 max-h-96"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BellOutlined className="text-blue-500" />
          <Title level={5} className="!mb-0">
            通知
          </Title>
          <Badge count={state.unreadCount} size="small" />
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshNotifications}
            className="p-1"
          >
            <ReloadOutlined className="text-xs" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleViewAll}
            className="p-1"
          >
            <SettingOutlined className="text-xs" />
          </Button>
        </div>
      </div>

      {/* 连接状态 */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
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
      <div className="max-h-80 overflow-y-auto">
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
            renderItem={(notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ backgroundColor: '#f8fafc' }}
                className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${
                  !notification.is_read ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  {/* 头像 */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {notification.sender?.avatar ? (
                      <img
                        src={notification.sender.avatar}
                        alt={notification.sender.nickname}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <BellOutlined className="text-xs text-gray-500" />
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                      <Text
                        className={`text-sm ${
                          !notification.is_read ? 'font-medium' : ''
                        }`}
                      >
                        {notification.content}
                      </Text>
                    </div>
                    <Text type="secondary" className="text-xs">
                      {formatTime(notification.created_at)}
                    </Text>
                  </div>
                </div>
              </motion.div>
            )}
          />
        )}
      </div>

      {/* 底部操作 */}
      {state.notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllAsRead}
            className="flex-1"
            disabled={state.unreadCount === 0}
          >
            <CheckOutlined className="mr-1" />
            全部已读
          </Button>
          <Button size="sm" onClick={handleViewAll} className="flex-1">
            查看全部
          </Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <Popover
      content={notificationContent}
      trigger="click"
      placement="bottomRight"
      overlayClassName="notification-popover"
      open={visible}
      onOpenChange={setVisible}
      arrow={false}
    >
      <Button
        variant="ghost"
        className={`relative p-2 rounded-lg ${className}`}
        onClick={() => setVisible(!visible)}
      >
        <Badge count={state.unreadCount} size="small" offset={[-2, 2]}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-6 h-6"
          >
            <BellOutlined className="text-lg" />
          </motion.div>
        </Badge>
      </Button>
    </Popover>
  );
};

export default NotificationBell;

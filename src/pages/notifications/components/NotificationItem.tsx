import type { NotificationItem as NotificationItemType } from '@/api/notification';
import { MarkNotificationAsRead } from '@/api/notification';
import UserAvatar from '@/components/ui/UserAvatar';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { motion } from 'framer-motion';
import type { FC } from 'react';

interface NotificationItemProps {
  notification: NotificationItemType;
  onRead?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSelect?: (id: number, selected: boolean) => void;
  selected?: boolean;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete,
  onSelect,
  selected = false,
}) => {
  const handleMarkAsRead = async () => {
    if (notification.is_read) return;

    try {
      await MarkNotificationAsRead(notification.id);
      message.success('标记为已读成功');
      onRead?.(notification.id);
    } catch (error) {
      message.error('标记已读失败');
    }
  };

  const handleDelete = () => {
    onDelete?.(notification.id);
  };

  const handleSelect = (checked: boolean) => {
    onSelect?.(notification.id, checked);
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case 'article_like':
        return '点赞';
      case 'article_favorite':
        return '收藏';
      case 'comment':
        return '评论';
      case 'comment_reply':
        return '回复';
      case 'comment_like':
        return '评论点赞';
      case 'follow':
        return '关注';
      default:
        return '通知';
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'article_like':
        return 'bg-red-100 text-red-600';
      case 'article_favorite':
        return 'bg-yellow-100 text-yellow-600';
      case 'comment':
        return 'bg-blue-100 text-blue-600';
      case 'comment_reply':
        return 'bg-purple-100 text-purple-600';
      case 'comment_like':
        return 'bg-pink-100 text-pink-600';
      case 'follow':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        }`}
    >
      <div className="flex items-start gap-3">
        {/* 选择框 */}
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => handleSelect(e.target.checked)}
          className="mt-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />

        {/* 发送者头像 */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          <UserAvatar user={notification.sender} />
        </div>

        {/* 通知内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">
              {notification.sender.username}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded-full ${getNotificationTypeColor(
                notification.type,
              )}`}
            >
              {getNotificationTypeText(notification.type)}
            </span>
            {!notification.is_read && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>

          <p className="text-gray-700 text-sm mb-2">{notification.content}</p>

          {notification.article && (
            <div className="text-sm text-gray-500 mb-2">
              文章：{notification.article.title}
            </div>
          )}

          <div className="text-xs text-gray-400">
            {notification.created_at}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          {!notification.is_read && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAsRead}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="标记为已读"
            >
              <EyeOutlined />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="删除"
          >
            <DeleteOutlined />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;

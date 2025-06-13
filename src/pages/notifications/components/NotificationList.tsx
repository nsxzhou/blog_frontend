import type { NotificationItem as NotificationItemType } from '@/api/notification';
import {
  BatchDeleteNotifications,
  DeleteNotification,
  MarkAllNotificationsAsRead,
} from '@/api/notification';
import {
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Empty, message, Modal } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import type { FC } from 'react';
import { useState } from 'react';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  notifications: NotificationItemType[];
  loading?: boolean;
  onRefresh?: () => void;
}

const NotificationList: FC<NotificationListProps> = ({
  notifications,
  loading = false,
  onRefresh,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // 处理单个选择
  const handleSelect = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(notifications.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 标记所有为已读
  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      await MarkAllNotificationsAsRead();
      message.success('已标记所有通知为已读');
      onRefresh?.();
    } catch (error) {
      console.error('标记所有通知为已读失败:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // 删除单个通知
  const handleDeleteNotification = async (id: number) => {
    try {
      await DeleteNotification(id);
      message.success('删除成功');
      onRefresh?.();
    } catch (error) {
      console.error('删除通知失败:', error);
    }
  };

  // 确认删除单个通知
  const confirmDeleteNotification = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确认要删除这条通知吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleDeleteNotification(id),
    });
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      message.warning('请先选择要删除的通知');
      return;
    }

    try {
      setActionLoading(true);
      await BatchDeleteNotifications({ notification_ids: selectedIds });
      message.success(`已删除 ${selectedIds.length} 条通知`);
      setSelectedIds([]);
      onRefresh?.();
    } catch (error) {
      console.error('批量删除失败:', error);
    } finally { 
      setActionLoading(false);
    }
  };

  // 确认批量删除
  const confirmBatchDelete = () => {
    if (selectedIds.length === 0) {
      message.warning('请先选择要删除的通知');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确认要删除选中的 ${selectedIds.length} 条通知吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleBatchDelete,
    });
  };

  const isAllSelected =
    selectedIds.length === notifications.length && notifications.length > 0;
  const hasUnreadNotifications = notifications.some((item) => !item.is_read);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse p-4 border-b border-gray-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-gray-200 rounded mt-2"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Empty
          description="暂无通知"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="text-gray-500"
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 批量操作栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
      >
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              全选 ({selectedIds.length}/{notifications.length})
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {hasUnreadNotifications && (
            <Button
              type="default"
              icon={<CheckOutlined />}
              loading={actionLoading}
              onClick={handleMarkAllAsRead}
              size="small"
            >
              全部已读
            </Button>
          )}

          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            loading={actionLoading}
            disabled={selectedIds.length === 0}
            onClick={confirmBatchDelete}
            size="small"
          >
            批量删除
          </Button>
        </div>
      </motion.div>

      {/* 通知列表 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              selected={selectedIds.includes(notification.id)}
              onSelect={handleSelect}
              onRead={() => onRefresh?.()}
              onDelete={confirmDeleteNotification}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationList;

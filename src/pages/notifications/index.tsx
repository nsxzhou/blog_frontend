import type { GetNotificationsReq } from '@/api/notification';
import { GetNotifications, GetUnreadCount } from '@/api/notification';
import { NotificationItem } from '@/api/notification/types';
import { fadeInUp } from '@/constants/animations';
import { WebSocketState } from '@/models/websocket';
import { BellOutlined, WifiOutlined } from '@ant-design/icons';
import { connect, Helmet } from '@umijs/max';
import { Badge, message, Pagination, Select, Tabs, Typography } from 'antd';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import NotificationList from './components/NotificationList';

const { Option } = Select;
const { Text } = Typography;

interface NotificationsPageProps {
  websocket: WebSocketState;
}

const NotificationsPage: FC<NotificationsPageProps> = ({ websocket }) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<GetNotificationsReq>({
    page: 1,
    page_size: 10,
  });

  // 获取通知列表
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [notificationsRes, unreadCountRes] = await Promise.all([
        GetNotifications(filters),
        GetUnreadCount(),
      ]);

      if (notificationsRes.code === 0) {
        setNotifications(notificationsRes.data.list);
        setTotal(notificationsRes.data.total);
      }

      if (unreadCountRes.code === 0) {
        setUnreadCount(unreadCountRes.data.count);
      }
    } catch (error) {
      console.error('获取通知列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 初始化加载
  useEffect(() => {
    fetchNotifications();
  }, []);

  // WebSocket 连接状态变化时刷新数据
  useEffect(() => {
    if (websocket.status === 'connected') {
      fetchNotifications();
    }
  }, [websocket.status, fetchNotifications]);

  // 处理筛选变化
  const handleFilterChange = useCallback(
    (key: keyof GetNotificationsReq, value: any) => {
      const newFilters = {
        ...filters,
        [key]: value,
        page: key === 'page' ? value : 1, // 除了翻页外，其他筛选都重置到第一页
      };
      setFilters(newFilters);
    },
    [filters],
  );

  // 处理分页变化
  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      handleFilterChange('page', page);
      handleFilterChange('page_size', pageSize);
    },
    [handleFilterChange],
  );

  // 刷新通知
  const refreshNotificationsWithFilters = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 处理Tab切换
  const handleTabChange = useCallback(
    (activeKey: string) => {
      const is_read =
        activeKey === 'read'
          ? true
          : activeKey === 'unread'
          ? false
          : undefined;
      handleFilterChange('is_read', is_read);
    },
    [handleFilterChange],
  );

  const getActiveTab = () => {
    if (filters.is_read === true) return 'read';
    if (filters.is_read === false) return 'unread';
    return 'all';
  };

  const tabItems = [
    {
      key: 'all',
      label: '全部通知',
      children: null,
    },
    {
      key: 'unread',
      label: (
        <span className="flex items-center gap-1">
          未读
          {unreadCount > 0 && <Badge count={unreadCount} size="small" />}
        </span>
      ),
      children: null,
    },
    {
      key: 'read',
      label: '已读',
      children: null,
    },
  ];

  return (
    <>
      <Helmet>
        <title>我的通知 - 博客系统</title>
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
            <BellOutlined className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">我的通知</h1>
            {unreadCount > 0 && <Badge count={unreadCount} />}
          </div>
          <p className="text-gray-600">
            管理您的系统通知，包括点赞、评论、关注等消息
          </p>
        </motion.div>

        {/* WebSocket连接状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <WifiOutlined className="text-blue-500" />
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    websocket.status === 'connected'
                      ? 'bg-green-500'
                      : websocket.status === 'connecting' ||
                        websocket.status === 'reconnecting'
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                />
                <Text type="secondary">
                  实时连接状态: {websocket.statusMessage}
                </Text>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 筛选区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Tab筛选 */}
              <Tabs
                activeKey={getActiveTab()}
                onChange={handleTabChange}
                items={tabItems}
                className="flex-1"
              />

              {/* 通知类型筛选 */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">通知类型：</span>
                <Select
                  value={filters.type}
                  onChange={(value) => handleFilterChange('type', value)}
                  placeholder="全部类型"
                  style={{ width: 120 }}
                  allowClear
                >
                  <Option value="article_like">点赞</Option>
                  <Option value="article_favorite">收藏</Option>
                  <Option value="comment">评论</Option>
                  <Option value="comment_reply">回复</Option>
                  <Option value="comment_like">评论点赞</Option>
                  <Option value="follow">关注</Option>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 通知列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <NotificationList
            notifications={notifications}
            loading={loading}
            onRefresh={refreshNotificationsWithFilters}
          />
        </motion.div>

        {/* 分页 */}
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <Pagination
              current={filters.page}
              pageSize={filters.page_size}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条通知`
              }
              pageSizeOptions={['10', '20', '50']}
            />
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default connect(({ websocket }: { websocket: WebSocketState }) => ({
  websocket,
}))(NotificationsPage);

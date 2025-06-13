import type { GetNotificationsReq } from '@/api/notification';
import { fadeInUp } from '@/constants/animations';
import { BellOutlined, WifiOutlined } from '@ant-design/icons';
import { Helmet } from '@umijs/max';
import { Badge, Pagination, Select, Tabs, Typography } from 'antd';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import NotificationList from './components/NotificationList';

const { Option } = Select;
const { Text } = Typography;

interface NotificationsPageProps {
  notification: any;
  dispatch: any;
  websocket: any;
}

const NotificationsPage: FC<NotificationsPageProps> = ({
  notification,
  dispatch,
  websocket,
}) => {
  const [filters, setFilters] = useState<GetNotificationsReq>({
    page: 1,
    page_size: 10,
  });

  // 处理筛选变化
  const handleFilterChange = useCallback(
    (key: keyof GetNotificationsReq, value: any) => {
      const newFilters = {
        ...filters,
        [key]: value,
        page: key === 'page' ? value : 1, // 除了翻页外，其他筛选都重置到第一页
      };
      setFilters(newFilters);

      // 获取新的通知数据
      dispatch({
        type: 'notification/fetchNotifications',
        payload: {
          page: newFilters.page,
          pageSize: newFilters.page_size,
          refresh: false,
          type: newFilters.type,
          is_read: newFilters.is_read,
        },
      });
    },
    [filters, dispatch],
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
    dispatch({ type: 'notification/refreshNotifications' });
  }, [dispatch]);

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
          {notification.unreadCount > 0 && (
            <Badge count={notification.unreadCount} size="small" />
          )}
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
            {notification.unreadCount > 0 && (
              <Badge count={notification.unreadCount} />
            )}
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
            notifications={notification.notifications}
            loading={notification.loading}
            onRefresh={refreshNotificationsWithFilters}
          />
        </motion.div>

        {/* 分页 */}
        {notification.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <Pagination
              current={notification.currentPage}
              pageSize={notification.pageSize}
              total={notification.total}
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

        {/* 统计信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          {/* <div className="inline-flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <BellOutlined />
              总通知: {notification.total}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircleOutlined />
              未读: {notification.unreadCount}
            </span>
            <span className="flex items-center gap-1">
              <WifiOutlined />
              连接: {notification.isConnected ? '已连接' : '未连接'}
            </span>
          </div> */}
        </motion.div>
      </motion.div>
    </>
  );
};

export default NotificationsPage;

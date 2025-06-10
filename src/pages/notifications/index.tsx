  import type { GetNotificationsReq, NotificationItem } from '@/api/notification';
  import { GetNotifications, GetUnreadCount } from '@/api/notification';
  import { fadeInUp } from '@/constants/animations';
  import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
  import { Helmet } from '@umijs/max';
  import { Badge, Pagination, Select, Tabs } from 'antd';
  import { motion } from 'framer-motion';
  import type { FC } from 'react';
  import { useCallback, useEffect, useState } from 'react';
  import NotificationList from './components/NotificationList';

  const { Option } = Select;

  interface NotificationData {
    total: number;
    unread_count: number;
    list: NotificationItem[];
  }

  const NotificationsPage: FC = () => {
    const [notifications, setNotifications] = useState<NotificationData>({
      total: 0,
      unread_count: 0,
      list: [],
    });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<GetNotificationsReq>({
      page: 1,
      page_size: 10,
    });


    // 获取通知列表
    const fetchNotifications = useCallback(async () => {
      try {
        setLoading(true);
        const response = await GetNotifications(filters);
        if (response.code === 0) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('获取通知列表失败:', error);
      } finally {
        setLoading(false);
      }
    }, [filters]);

    // 获取未读数量
    const fetchUnreadCount = useCallback(async () => {
      try {
        const response = await GetUnreadCount();
        if (response.code === 0) {
          setNotifications((prev) => ({
            ...prev,
            unread_count: response.data.count,
          }));
        }
      } catch (error) {
        console.error('获取未读数量失败:', error);
      }
    }, []);

    // 刷新数据
    const handleRefresh = useCallback(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, [fetchNotifications, fetchUnreadCount]);

    useEffect(() => {
      fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount]);

    // 处理筛选变化
    const handleFilterChange = (key: keyof GetNotificationsReq, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === 'page' ? value : 1, // 除了翻页外，其他筛选都重置到第一页
      }));
    };

    // 处理分页变化
    const handlePageChange = (page: number, pageSize: number) => {
      setFilters((prev) => ({
        ...prev,
        page,
        page_size: pageSize,
      }));
    };

    // 处理Tab切换
    const handleTabChange = (activeKey: string) => {
      const is_read =
        activeKey === 'read' ? true : activeKey === 'unread' ? false : undefined;
      handleFilterChange('is_read', is_read);
    };

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
            {notifications.unread_count > 0 && (
              <Badge count={notifications.unread_count} size="small" />
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
              {notifications.unread_count > 0 && (
                <Badge count={notifications.unread_count} />
              )}
            </div>
            <p className="text-gray-600">
              管理您的系统通知，包括点赞、评论、关注等消息
            </p>
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
                    <Option value="article_comment">评论</Option>
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
              notifications={notifications.list}
              loading={loading}
              onRefresh={handleRefresh}
            />
          </motion.div>

          {/* 分页 */}
          {notifications.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex justify-center"
            >
              <Pagination
                current={filters.page}
                pageSize={filters.page_size}
                total={notifications.total}
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
            <div className="inline-flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <BellOutlined />
                总通知: {notifications.total}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircleOutlined />
                未读: {notifications.unread_count}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </>
    );
  };

  export default NotificationsPage;

import {
  BatchActionUsers,
  GetUsers,
  GetUserStats,
  ResetUserPassword,
  UpdateUserStatus,
  type GetUsersReq,
  type GetUserStatsRes,
  type UserInfo,
} from '@/api/user';
import {
  containerVariants,
  itemVariants,
  pageVariants,
} from '@/constants/animations';
import { message, Modal, Spin } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { UserActions, UserFilters, UserStats, UserTable } from './components';
import './styles.css';
import { FilterParams, SortParams } from './types';

const UserManagementPage: React.FC = () => {
  // 状态管理
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statistics, setStatistics] = useState<GetUserStatsRes | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [batchMode, setBatchMode] = useState(false);

  // 分页和筛选参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const [filters, setFilters] = useState<FilterParams>({
    keyword: '',
    role: '',
    status: 2, // 2 表示全部状态
  });

  const [sorting, setSorting] = useState<SortParams>({
    order_by: 'created_at',
    order: 'desc',
  });

  // 获取用户列表
  const fetchUsers = async (params?: Partial<GetUsersReq>) => {
    setLoading(true);
    try {
      const query: GetUsersReq = {
        page: pagination.current,
        page_size: pagination.pageSize,
        keyword: filters.keyword || '',
        role: filters.role === '' ? '' : filters.role,
        status: filters.status === 2 ? 2 : filters.status,
        order_by: sorting.order_by,
        order: sorting.order,
        ...params,
      };

      const response = await GetUsers(query);
      if (response.code === 0 && response.data) {
        setUsers(response.data.list || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          current: params?.page || pagination.current,
        }));
      } else {
        setUsers([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          current: 1,
        }));
        message.error(response.message || '获取用户列表失败');
      }
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('获取用户列表失败:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    setStatsLoading(true);
    try {
      const response = await GetUserStats();
      if (response.code === 0) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, []);

  // 筛选和排序变化时重新获取数据
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchUsers({ page: 1 });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, sorting]);

  // 处理筛选变化
  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 处理排序变化
  const handleSortChange = (newSorting: SortParams) => {
    setSorting(newSorting);
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    const newPagination = {
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize,
    };
    setPagination(newPagination);
    fetchUsers({ page, page_size: newPagination.pageSize });
  };

  // 用户操作处理
  const handleStatusChange = async (id: number, status: number) => {
    try {
      const response = await UpdateUserStatus(id, { status });
      if (response.code === 0) {
        message.success('用户状态更新成功');
        fetchUsers();
        fetchStatistics();
      } 
    } catch (error) { 
      console.error('状态更新失败:', error);
    }
  };

  const handleResetPassword = async (id: number, newPassword: string) => {
    try {
      const response = await ResetUserPassword(id, {
        new_password: newPassword,
      });
      if (response.code === 0) {
        message.success('密码重置成功');
      } 
    } catch (error) { 
      console.error('密码重置失败:', error);
    }
  };

  const handleBatchAction = async (action: 'enable' | 'disable' | 'delete') => {
    if (selectedUsers.length === 0) {
      message.warning('请先选择用户');
      return;
    }

    const actionMap = {
      enable: '启用',
      disable: '禁用',
      delete: '删除',
    };

    Modal.confirm({
      title: `确认${actionMap[action]}`,
      content: `确定要${actionMap[action]}选中的 ${selectedUsers.length} 个用户吗？`,
      okText: `确认${actionMap[action]}`,
      cancelText: '取消',
      okType: action === 'delete' ? 'danger' : 'primary',
      onOk: async () => {
        try {
          const response = await BatchActionUsers({
            action,
            user_ids: selectedUsers,
          });
          if (response.code === 0) {
            message.success(`批量${actionMap[action]}成功`);
            setSelectedUsers([]);
            setBatchMode(false);
            fetchUsers();
            fetchStatistics();
          } 
        } catch (error) { 
          console.error(`批量${actionMap[action]}失败:`, error);
        }
      },
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题 */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">用户管理</h1>
          <p className="text-gray-600">管理系统中的所有用户账户</p>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <UserStats statistics={statistics} loading={statsLoading} />
        </motion.div>

        {/* 操作栏 */}
        <motion.div variants={itemVariants} className="mb-6">
          <UserActions
            selectedUsers={selectedUsers}
            batchMode={batchMode}
            onBatchModeChange={setBatchMode}
            onBatchAction={handleBatchAction}
            onSelectionClear={() => setSelectedUsers([])}
          />
        </motion.div>

        {/* 筛选器 */}
        <motion.div variants={itemVariants} className="mb-6">
          <UserFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sorting={sorting}
          />
        </motion.div>

        {/* 用户表格 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm"
        >
          <Spin spinning={loading}>
            <UserTable
              users={users}
              batchMode={batchMode}
              selectedUsers={selectedUsers}
              pagination={pagination}
              onSelectionChange={setSelectedUsers}
              onPageChange={handlePageChange}
              onStatusChange={handleStatusChange}
              onResetPassword={handleResetPassword}
            />
          </Spin>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserManagementPage;

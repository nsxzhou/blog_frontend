import { type UserInfo } from '@/api/user';
import UserAvatar from '@/components/ui/UserAvatar';
import { fadeInUp, hoverScale, itemVariants } from '@/constants/animations';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  HeartOutlined,
  KeyOutlined,
  MailOutlined,
  MoreOutlined,
  StopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Empty,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { type RoleConfig, type StatusConfig } from '../types';

interface UserTableProps {
  users: UserInfo[];
  batchMode: boolean;
  selectedUsers: number[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onSelectionChange: (selectedIds: number[]) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  onStatusChange: (id: number, status: number) => void;
  onResetPassword: (id: number, newPassword: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  batchMode,
  selectedUsers,
  pagination,
  onSelectionChange,
  onPageChange,
  onStatusChange,
  onResetPassword,
}) => {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [newPassword, setNewPassword] = useState('');

  // 状态配置
  const statusConfigs: Record<number, StatusConfig> = {
    1: { color: 'text-green-700', bgColor: 'bg-green-100', text: '正常' },
    0: { color: 'text-red-700', bgColor: 'bg-red-100', text: '禁用' },
  };

  // 角色配置
  const roleConfigs: Record<string, RoleConfig> = {
    admin: {
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      text: '管理员',
      priority: 1,
    },
    user: {
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      text: '普通用户',
      priority: 2,
    },
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 处理密码重置
  const handlePasswordReset = (userId: number) => {
    setCurrentUserId(userId);
    setPasswordModalVisible(true);
  };

  // 确认密码重置
  const handlePasswordConfirm = () => {
    if (newPassword.trim()) {
      onResetPassword(currentUserId, newPassword);
      setPasswordModalVisible(false);
      setNewPassword('');
      setCurrentUserId(0);
    }
  };

  // 生成随机密码
  const generateRandomPassword = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  // 表格列定义
  const columns = [
    // 批量选择列
    ...(batchMode
      ? [
        {
          title: '选择',
          dataIndex: 'selection',
          key: 'selection',
          width: 60,
          render: (_: any, record: UserInfo) => (
            <motion.div {...hoverScale}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(record.id)}
                onChange={(e) => {
                  const newSelected = e.target.checked
                    ? [...selectedUsers, record.id]
                    : selectedUsers.filter((id) => id !== record.id);
                  onSelectionChange(newSelected);
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </motion.div>
          ),
        },
      ]
      : []),

    // 用户信息列
    {
      title: '用户信息',
      dataIndex: 'user_info',
      key: 'user_info',
      width: 300,
      render: (_: any, record: UserInfo) => (
        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-3"
        >
          {/* 头像 */}
          <div className="flex-shrink-0">
            <UserAvatar
              size="lg"
              src={record.avatar}
              user={record}
              className="border-2 border-gray-200"
            />
          </div>

          {/* 用户详情 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {record.username}
              </h3>
              {record.role === 'admin' && (
                <CrownOutlined className="text-orange-500 text-xs" />
              )}
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-1">
                <UserOutlined className="text-xs" />
                <span className="truncate">@{record.username}</span>
              </div>
              <div className="flex items-center gap-1">
                <MailOutlined className="text-xs" />
                <span className="truncate">{record.email}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ),
    },

    // 角色列
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => {
        const config = roleConfigs[role] || roleConfigs.user;
        return (
          <motion.div variants={hoverScale}>
            <Tag
              className={`${config.bgColor} ${config.color} border-0 px-2 py-1 rounded-full text-xs font-medium`}
            >
              {config.text}
            </Tag>
          </motion.div>
        );
      },
    },

    // 状态列
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: number, record: UserInfo) => {
        const config = statusConfigs[status] || statusConfigs[0];
        return (
          <motion.div variants={hoverScale}>
            <Popconfirm
              title={`确定要${status === 1 ? '禁用' : '启用'}该用户吗？`}
              onConfirm={() => onStatusChange(record.id, status === 1 ? 0 : 1)}
              okText="确定"
              cancelText="取消"
            >
              <Switch
                checked={status === 1}
                size="small"
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<StopOutlined />}
              />
            </Popconfirm>
            <div className="mt-1">
              <Tag
                className={`${config.bgColor} ${config.color} border-0 px-2 py-1 rounded-full text-xs`}
              >
                {config.text}
              </Tag>
            </div>
          </motion.div>
        );
      },
    },

    // 统计信息列
    {
      title: '统计信息',
      dataIndex: 'stats',
      key: 'stats',
      width: 160,
      render: (_: any, record: UserInfo) => (
        <motion.div variants={itemVariants}>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <Space size={4}>
                <FileTextOutlined className="text-blue-500" />
                <span className="text-gray-600">文章</span>
              </Space>
              <span className="font-medium text-gray-900">
                {formatNumber(record.articles_count || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <Space size={4}>
                <HeartOutlined className="text-red-500" />
                <span className="text-gray-600">粉丝</span>
              </Space>
              <span className="font-medium text-gray-900">
                {formatNumber(record.followers_count || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <Space size={4}>
                <TeamOutlined className="text-green-500" />
                <span className="text-gray-600">关注</span>
              </Space>
              <span className="font-medium text-gray-900">
                {formatNumber(record.following_count || 0)}
              </span>
            </div>
          </div>
        </motion.div>
      ),
    },

    // 注册时间列
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (created_at: string) => (
        <motion.div variants={itemVariants}>
          <div className="text-sm">
            <div className="flex items-center gap-1 text-gray-900">
              <CalendarOutlined className="text-xs text-gray-400" />
              <span>{formatDate(created_at)}</span>
            </div>
          </div>
        </motion.div>
      ),
    },

    // 操作列
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: any, record: UserInfo) => (
        <motion.div variants={itemVariants}>
          <Space size="small">
            <Tooltip title="查看详情">
              <motion.div variants={hoverScale}>
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  type="text"
                  className="text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    message.info('敬请期待');
                  }}
                />
              </motion.div>
            </Tooltip>

            <Dropdown
              menu={{
                items: [
                  {
                    key: 'edit',
                    label: '编辑用户',
                    icon: <EditOutlined />,
                  },
                  {
                    key: 'reset-password',
                    label: '重置密码',
                    icon: <KeyOutlined />,
                    onClick: () => handlePasswordReset(record.id),
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'delete',
                    label: '删除用户',
                    icon: <DeleteOutlined />,
                    danger: true,
                  },
                ],
              }}
              trigger={['click']}
            >
              <motion.div variants={hoverScale}>
                <Button
                  icon={<MoreOutlined />}
                  size="small"
                  type="text"
                  className="text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    message.info('敬请期待');
                  }}
                />
              </motion.div>
            </Dropdown>
          </Space>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: onPageChange,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无用户数据"
              />
            ),
          }}
          className="custom-table"
        />
      </motion.div>

      {/* 密码重置模态框 */}
      <Modal
        title="重置用户密码"
        open={passwordModalVisible}
        onOk={handlePasswordConfirm}
        onCancel={() => {
          setPasswordModalVisible(false);
          setNewPassword('');
          setCurrentUserId(0);
        }}
        okText="确认重置"
        cancelText="取消"
        width={400}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新密码
            </label>
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="请输入新密码"
              className="w-full"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="link"
              size="small"
              onClick={generateRandomPassword}
              className="text-blue-600"
            >
              生成随机密码
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            密码长度建议在 6-20 位之间，包含字母和数字
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserTable;

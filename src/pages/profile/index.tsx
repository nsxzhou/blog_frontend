import {
  ChangePassword,
  GetUserInfo,
  UpdateUserInfo,
  type ChangePasswordReq,
  type UpdateUserInfoReq,
  type UserInfo,
} from '@/api/user';
import { containerVariants, itemVariants } from '@/constants';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { message, Spin, Tabs } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  PasswordChangeForm,
  UserEditForm,
  UserInfoCard,
} from './components/index';

// 模拟统计数据
const mockStats = {
  articles: 23,
  views: 15623,
  likes: 892,
  comments: 234,
  followers: 156,
  following: 89,
};

// 模拟活动数据
const mockActivities = [
  {
    id: '1',
    type: 'article' as const,
    title: '发布了新文章',
    description: 'React 18 并发特性深度解析',
    time: '2024-01-15T10:30:00Z',
    target: 'React 18 并发特性深度解析',
  },
  {
    id: '2',
    type: 'like' as const,
    title: '收到了点赞',
    description: '您的文章《TypeScript 高级类型技巧总结》收到了新的点赞',
    time: '2024-01-15T09:15:00Z',
    target: 'TypeScript 高级类型技巧总结',
  },
  {
    id: '3',
    type: 'comment' as const,
    title: '收到了评论',
    description: '用户在您的文章下发表了评论',
    time: '2024-01-14T16:20:00Z',
    target: '微前端架构设计与实践',
  },
  {
    id: '4',
    type: 'follow' as const,
    title: '新增粉丝',
    description: '用户 张三 关注了您',
    time: '2024-01-14T14:45:00Z',
  },
  {
    id: '5',
    type: 'edit' as const,
    title: '更新了文章',
    description: '编辑了文章《Node.js 性能优化实战》',
    time: '2024-01-13T11:30:00Z',
    target: 'Node.js 性能优化实战',
  },
];

const ProfilePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await GetUserInfo();
        if (response.code === 0 && response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        message.error('获取用户信息失败');
        // 使用初始状态中的用户信息作为后备
        if (initialState?.currentUser) {
          setUser(initialState.currentUser);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [initialState?.currentUser]);

  // 更新用户信息
  const handleUpdateUser = async (data: UpdateUserInfoReq) => {
    try {
      setUpdateLoading(true);
      const response = await UpdateUserInfo(data);
      if (response.code === 0 && response.data) {
        setUser(response.data.user);
        setIsEditing(false);
        message.success('信息更新成功');
      }
    } catch (error) {
      message.error('更新失败，请重试');
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (data: ChangePasswordReq) => {
    try {
      setPasswordLoading(true);
      const response = await ChangePassword(data);
      if (response.code === 0) {
        message.success('密码修改成功');
      }
    } catch (error) {
      message.error('密码修改失败，请检查原密码是否正确');
      throw error;
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'info',
      label: (
        <span>
          <UserOutlined />
          个人信息
        </span>
      ),
      children: (
        <div className="space-y-6">
          {isEditing ? (
            <UserEditForm
              user={user!}
              onSave={handleUpdateUser}
              onCancel={() => setIsEditing(false)}
              loading={updateLoading}
            />
          ) : (
            <UserInfoCard user={user!} onEdit={() => setIsEditing(true)} />
          )}
        </div>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined />
          安全设置
        </span>
      ),
      children: (
        <PasswordChangeForm
          onSubmit={handleChangePassword}
          loading={passwordLoading}
        />
      ),
    },
    // {
    //   key: 'stats',
    //   label: (
    //     <span>
    //       <BarChartOutlined />
    //       数据统计
    //     </span>
    //   ),
    //   children: <ProfileStats stats={mockStats} />,
    // },
    // {
    //   key: 'activity',
    //   label: (
    //     <span>
    //       <HistoryOutlined />
    //       最近活动
    //     </span>
    //   ),
    //   children: <ActivityTimeline activities={mockActivities} />,
    // },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="text-gray-600 mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            用户信息加载失败
          </h2>
          <p className="text-gray-600">请刷新页面重试</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">个人中心</h1>
          <p className="text-gray-600 mt-2">管理您的个人信息和账户设置</p>
        </motion.div>

        {/* 标签页内容 */}
        <motion.div variants={itemVariants}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{
              backgroundColor: 'white',
              padding: '0 24px',
              borderRadius: '12px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
            items={tabItems}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;

import {
  ChangePassword,
  GetUserInfo,
  UpdateUserInfo,
  type ChangePasswordReq,
  type UpdateUserInfoReq,
  type UserInfo,
} from '@/api/user';
import { containerVariants, itemVariants } from '@/constants';
import { UserModelState } from '@/models/user';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from '@umijs/max';
import { message, Spin, Tabs } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  PasswordChangeForm,
  UserEditForm,
  UserInfoCard,
} from './components/index';

const ProfilePage: React.FC<{ user: UserModelState }> = ({ user }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(user.currentUser);
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
          setUserInfo(response.data.user);
        }
      } catch (error) {
        message.error('获取用户信息失败');
        // 使用初始状态中的用户信息作为后备
        if (user) {
          setUserInfo(user.currentUser);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  // 更新用户信息
  const handleUpdateUser = async (data: UpdateUserInfoReq) => {
    try {
      setUpdateLoading(true);
      const response = await UpdateUserInfo(data);
      if (response.code === 0 && response.data) {
        setUserInfo(response.data.user);
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
              user={userInfo!}
              onSave={handleUpdateUser}
              onCancel={() => setIsEditing(false)}
              loading={updateLoading}
            />
          ) : (
            <UserInfoCard user={userInfo!} onEdit={() => setIsEditing(true)} />
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

export default connect(({ user }: { user: UserModelState }) => ({
  user,
}))(ProfilePage);

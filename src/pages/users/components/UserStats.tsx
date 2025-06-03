import { type GetUserStatsRes } from '@/api/user';
import { cardHover, itemVariants } from '@/constants/animations';
import {
  CheckCircleOutlined,
  CrownOutlined,
  StopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Spin } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface UserStatsProps {
  statistics: GetUserStatsRes | null;
  loading: boolean;
}

const UserStats: React.FC<UserStatsProps> = ({ statistics, loading }) => {
  const statsCards = [
    {
      title: '总用户数',
      value: statistics?.total_users || 0,
      icon: <TeamOutlined className="text-blue-500" />,
      color: 'border-blue-200 bg-blue-50',
      valueColor: 'text-blue-600',
    },
    {
      title: '活跃用户',
      value: statistics?.active_users || 0,
      icon: <CheckCircleOutlined className="text-green-500" />,
      color: 'border-green-200 bg-green-50',
      valueColor: 'text-green-600',
    },
    {
      title: '禁用用户',
      value: statistics?.disabled_users || 0,
      icon: <StopOutlined className="text-red-500" />,
      color: 'border-red-200 bg-red-50',
      valueColor: 'text-red-600',
    },
    {
      title: '管理员',
      value: statistics?.admin_users || 0,
      icon: <CrownOutlined className="text-orange-500" />,
      color: 'border-orange-200 bg-orange-50',
      valueColor: 'text-orange-600',
    },
    {
      title: '新用户',
      value: statistics?.new_users || 0,
      icon: <UserOutlined className="text-purple-500" />,
      color: 'border-purple-200 bg-purple-50',
      valueColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="text-center">
            <Spin />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
    >
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          {...cardHover}
          className={`p-6 rounded-lg border-2 ${stat.color} cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">{stat.icon}</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${stat.valueColor} mb-1`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-gray-600 text-sm font-medium">
              {stat.title}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserStats;

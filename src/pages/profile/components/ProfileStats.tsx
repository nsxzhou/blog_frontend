import { cardHover, itemVariants } from '@/constants';
import {
  EyeOutlined,
  FileTextOutlined,
  HeartOutlined,
  MessageOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import React from 'react';

interface StatsData {
  articles: number;
  views: number;
  likes: number;
  comments: number;
  followers: number;
  following: number;
}

interface ProfileStatsProps {
  stats: StatsData;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const statItems = [
    {
      key: 'articles',
      label: '发表文章',
      value: stats.articles,
      icon: <FileTextOutlined />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'views',
      label: '总阅读量',
      value: stats.views,
      icon: <EyeOutlined />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      key: 'likes',
      label: '获得点赞',
      value: stats.likes,
      icon: <HeartOutlined />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      key: 'comments',
      label: '收到评论',
      value: stats.comments,
      icon: <MessageOutlined />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      key: 'followers',
      label: '粉丝数',
      value: stats.followers,
      icon: <UserOutlined />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      key: 'following',
      label: '关注数',
      value: stats.following,
      icon: <TrophyOutlined />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">数据统计</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((item) => (
          <motion.div
            key={item.key}
            className="flex items-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            {...cardHover}
          >
            <div
              className={`p-3 rounded-full ${item.bgColor} ${item.color} mr-4`}
            >
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(item.value)}
              </div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileStats;

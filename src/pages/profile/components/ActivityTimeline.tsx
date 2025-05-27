import { itemVariants } from '@/constants';
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  HeartOutlined,
  MessageOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import React from 'react';

interface ActivityItem {
  id: string;
  type: 'article' | 'like' | 'comment' | 'follow' | 'edit' | 'delete';
  title: string;
  description: string;
  time: string;
  target?: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'article':
        return <FileTextOutlined className="text-blue-600" />;
      case 'like':
        return <HeartOutlined className="text-red-600" />;
      case 'comment':
        return <MessageOutlined className="text-green-600" />;
      case 'follow':
        return <UserAddOutlined className="text-purple-600" />;
      case 'edit':
        return <EditOutlined className="text-orange-600" />;
      case 'delete':
        return <DeleteOutlined className="text-gray-600" />;
      default:
        return <FileTextOutlined className="text-gray-600" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'article':
        return 'border-blue-200 bg-blue-50';
      case 'like':
        return 'border-red-200 bg-red-50';
      case 'comment':
        return 'border-green-200 bg-green-50';
      case 'follow':
        return 'border-purple-200 bg-purple-50';
      case 'edit':
        return 'border-orange-200 bg-orange-50';
      case 'delete':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTime = (timeStr: string) => {
    const time = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - time.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return time.toLocaleDateString();
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">最近活动</h2>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-4 p-4 rounded-lg border ${getActivityColor(
                activity.type,
              )}`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                {activity.target && (
                  <p className="text-xs text-gray-500 mt-1">
                    相关: {activity.target}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0 text-xs text-gray-500">
                {formatTime(activity.time)}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileTextOutlined className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500">暂无活动记录</p>
            <p className="text-sm text-gray-400 mt-1">
              开始创作您的第一篇文章吧！
            </p>
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-6 text-center">
          <motion.button
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            查看更多活动
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityTimeline;

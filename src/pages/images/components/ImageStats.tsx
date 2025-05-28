import { cardHover, itemVariants } from '@/constants/animations';
import {
  BarChartOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { Spin } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';
import type { ImageStatsProps } from './types';

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const ImageStats: React.FC<ImageStatsProps> = ({ statistics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-center">
              <Spin />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  const statsCards = [
    {
      title: '图片总数',
      value: formatNumber(statistics.total_images || 0),
      icon: PictureOutlined,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeColor: 'text-green-600',
    },
    {
      title: '总存储空间',
      value: formatFileSize(statistics.total_size || 0),
      icon: CloudUploadOutlined,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      title: '使用分类',
      value: formatNumber(
        (statistics.avatar_images || 0) +
          (statistics.cover_images || 0) +
          (statistics.content_images || 0),
      ),
      subtitle: `头像:${statistics.avatar_images || 0} · 封面:${
        statistics.cover_images || 0
      } · 内容:${statistics.content_images || 0}`,
      icon: BarChartOutlined,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%',
      changeColor: 'text-green-600',
    },
    {
      title: '存储分布',
      value: formatNumber(
        (statistics.local_images || 0) + (statistics.cos_images || 0),
      ),
      subtitle: `本地:${statistics.local_images || 0} · COS:${
        statistics.cos_images || 0
      }`,
      icon: DatabaseOutlined,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 'stable',
      changeColor: 'text-gray-600',
    },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          {...cardHover}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </p>
              {(card as any).subtitle && (
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                  {(card as any).subtitle}
                </p>
              )}
              <div className="flex items-center">
                <span className={`text-xs ${card.changeColor} font-medium`}>
                  {card.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">vs 上月</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor} ml-3`}>
              <card.icon className={`text-xl ${card.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ImageStats;

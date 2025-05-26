import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileTextOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import type { ArticleStats } from '../types';

interface StatsCardsProps {
  stats: ArticleStats;
}

const statsItems = [
  {
    key: 'totalArticles',
    label: '总文章数',
    icon: <FileTextOutlined />,
    color: 'blue',
  },
  {
    key: 'totalViews',
    label: '总阅读量',
    icon: <EyeOutlined />,
    color: 'green',
  },
  {
    key: 'totalLikes',
    label: '总点赞数',
    icon: <HeartOutlined />,
    color: 'red',
  },
  {
    key: 'totalComments',
    label: '总评论数',
    icon: <MessageOutlined />,
    color: 'purple',
  },
];

const colorClasses = {
  blue: {
    icon: 'text-blue-600 bg-blue-50',
    accent: 'text-blue-600',
    border: 'border-blue-100',
  },
  green: {
    icon: 'text-green-600 bg-green-50',
    accent: 'text-green-600',
    border: 'border-green-100',
  },
  red: {
    icon: 'text-red-600 bg-red-50',
    accent: 'text-red-600',
    border: 'border-red-100',
  },
  purple: {
    icon: 'text-purple-600 bg-purple-50',
    accent: 'text-purple-600',
    border: 'border-purple-100',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statsItems.map((item, index) => {
        const colors = colorClasses[item.color as keyof typeof colorClasses];
        const todayIncrease = Math.floor(Math.random() * 50) + 1;

        return (
          <motion.div
            key={item.key}
            variants={cardVariants}
            whileHover={{
              y: -4,
              transition: { duration: 0.2 }
            }}
            className={`
              relative overflow-hidden rounded-xl p-6 
              bg-white border ${colors.border}
              shadow-sm hover:shadow-md 
              transition-all duration-300 ease-out
              group
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-lg
                ${colors.icon}
              `}>
                <span className="text-lg">{item.icon}</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                <RiseOutlined className="text-green-500" />
                <span>+{todayIncrease}</span>
              </div>
            </div>

            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900">
                {(stats[item.key as keyof ArticleStats] as number).toLocaleString()}
              </div>
            </div>

            <div className="text-sm font-medium text-gray-600">
              {item.label}
            </div>

            {/* 简单的装饰线条 */}
            <motion.div
              className={`absolute bottom-0 left-0 h-1 ${colors.accent.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100`}
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export { StatsCards };
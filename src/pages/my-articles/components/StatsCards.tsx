import React from 'react';
import { motion } from 'framer-motion';
import {
  FileTextOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
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
  blue: 'from-blue-500 to-blue-600 text-white',
  green: 'from-green-500 to-green-600 text-white',
  red: 'from-red-500 to-red-600 text-white',
  purple: 'from-purple-500 to-purple-600 text-white',
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsItems.map((item, index) => (
        <motion.div
          key={item.key}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className={`
            relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${colorClasses[item.color as keyof typeof colorClasses]}
            shadow-lg hover:shadow-xl transition-all duration-300
          `}
        >
          {/* 背景装饰 */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div 
                className="text-2xl opacity-90 flex items-center justify-center w-10 h-10"
                style={{ fontSize: '24px', lineHeight: 1 }}
              >
                {item.icon}
              </div>
              <div className="text-xs opacity-70 font-medium">
                今日 +{Math.floor(Math.random() * 50)}
              </div>
            </div>
            
            <div className="mb-1">
              <div className="text-2xl font-bold">
                {(stats[item.key as keyof ArticleStats] as number).toLocaleString()}
              </div>
            </div>
            
            <div className="text-sm opacity-90 font-medium">
              {item.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}; 
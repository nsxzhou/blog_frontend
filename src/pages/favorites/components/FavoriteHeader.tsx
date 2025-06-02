import { fadeInUp, itemVariants } from '@/constants/animations';
import { motion } from 'framer-motion';
import React from 'react';

interface FavoriteHeaderProps {
  totalCount: number;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
}> = ({ title, value }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -2, scale: 1.02 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-1">
          {title}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {value.toLocaleString()}
        </div>
      </div>
    </div>
  </motion.div>
);

const FavoriteHeader: React.FC<FavoriteHeaderProps> = ({ totalCount }) => {
  return (
    <motion.div variants={fadeInUp} className="space-y-6">
      {/* 页面标题 */}
      <div>
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">我的收藏</h1>
          <p className="text-lg text-gray-600">管理您收藏的精彩文章</p>
        </motion.div>
      </div>

      {/* 收藏提示 */}
      {totalCount === 0 && (
        <motion.div variants={itemVariants} className="text-center py-8">
          <div className="text-gray-500 text-sm">
            还没有收藏任何文章，快去发现感兴趣的内容吧！
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FavoriteHeader;

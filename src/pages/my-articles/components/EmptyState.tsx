import React from 'react';
import { motion } from 'framer-motion';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import {
  emptyStateVariants,
  floatingAnimation,
  hoverScale
} from '@/constants';

interface EmptyStateProps {
  onCreateClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <motion.div
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* 动画图标 */}
      <motion.div
        {...floatingAnimation}
        className="mb-8"
      >
        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <EditOutlined className="text-4xl text-blue-400" />
        </div>
      </motion.div>

      {/* 文本内容 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          还没有文章
        </h3>
        <p className="text-gray-500 max-w-md">
          开始创作你的第一篇文章，分享你的想法和经验给更多的人。
        </p>
      </div>

      {/* 创建按钮 */}
      <motion.button
        onClick={onCreateClick}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        {...hoverScale}
      >
        <PlusOutlined />
        <span>创建第一篇文章</span>
      </motion.button>

      {/* 装饰元素 */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 可以添加一些装饰性的动画元素 */}
      </motion.div>
    </motion.div>
  );
};

export { EmptyState }; 
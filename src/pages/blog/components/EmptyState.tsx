import React from 'react';
import { motion } from 'framer-motion';

const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">没有找到相关文章</h3>
      <p className="text-gray-500">尝试调整搜索条件或浏览其他分类</p>
    </motion.div>
  );
};

export default EmptyState; 
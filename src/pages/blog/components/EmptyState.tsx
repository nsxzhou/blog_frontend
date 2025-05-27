import React from 'react';
import { motion } from 'framer-motion';
import { emptyStateVariants } from '@/constants/animations';

const EmptyState: React.FC = () => {
  return (
    <motion.div
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      className="text-center py-12"
    >
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无文章</h3>
      <p className="text-gray-600">还没有发布任何文章，请稍后再来查看</p>
    </motion.div>
  );
};

export default EmptyState; 
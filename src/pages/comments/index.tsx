import { containerVariants, itemVariants } from '@/constants/animations';
import { motion } from 'framer-motion';
import React from 'react';
import { CommentsManageView } from './components';
import { useCommentsManage } from './hooks/useCommentsManage';

/**
 * 评论管理页面
 * 重构后的主页面，逻辑简化并抽离到hooks中
 */
const CommentsManagePage: React.FC = () => {
  const commentsManageState = useCommentsManage();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants}>
          <CommentsManageView {...commentsManageState} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommentsManagePage;

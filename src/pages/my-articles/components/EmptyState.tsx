import React from 'react';
import { motion } from 'framer-motion';
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';

interface EmptyStateProps {
  onCreateNew?: () => void;
}

const emptyVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <motion.div
      variants={emptyVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* 图标动画 */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-6"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <FileTextOutlined className="text-4xl text-gray-400" />
        </div>
      </motion.div>

      {/* 文本内容 */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          还没有文章
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          开始写作，分享你的想法和见解。创建你的第一篇文章吧！
        </p>

        {/* 创建按钮 */}
        {onCreateNew && (
          <motion.button
            onClick={onCreateNew}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusOutlined />
            <span>写第一篇文章</span>
          </motion.button>
        )}
      </div>

      {/* 装饰性元素 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-4 -right-4 w-32 h-32 border-2 border-dashed border-gray-200 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-8 -left-8 w-40 h-40 border-2 border-dashed border-gray-200 rounded-full"
        />
      </div>
    </motion.div>
  );
}; 
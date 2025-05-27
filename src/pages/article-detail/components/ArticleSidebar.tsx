import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartOutlined,
  ShareAltOutlined,
  BookOutlined,
  EyeOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { sidebarVariants, itemVariants } from '@/constants/animations';

interface ArticleSidebarProps {
  likes: number;
  views: number;
  readingTime: string;
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  likes,
  views,
  readingTime,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* 主要操作按钮 */}
        <div className="p-4 space-y-3">
          {/* 点赞按钮 */}
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleLike}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isLiked
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HeartOutlined className="text-lg" />
          </motion.button>

          {/* 展开/收起按钮 */}
          <motion.button
            onClick={toggleExpand}
            className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <DownOutlined />
            </motion.div>
          </motion.button>
        </div>

        {/* 展开的内容 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-t border-gray-100"
            >
              <div className="p-4 space-y-4">
                {/* 分享按钮 */}
                <motion.button
                  variants={itemVariants}
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShareAltOutlined />
                  <span className="text-sm font-medium">分享文章</span>
                </motion.button>

                {/* 统计信息 */}
                <div className="space-y-2">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between text-sm text-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <HeartOutlined className="text-red-500" />
                      <span>点赞</span>
                    </div>
                    <span className="font-medium">{likes}</span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between text-sm text-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <EyeOutlined className="text-blue-500" />
                      <span>阅读</span>
                    </div>
                    <span className="font-medium">{views}</span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between text-sm text-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <BookOutlined className="text-green-500" />
                      <span>用时</span>
                    </div>
                    <span className="font-medium">{readingTime}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default ArticleSidebar;
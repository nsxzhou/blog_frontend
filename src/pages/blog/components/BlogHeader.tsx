import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOutlined,
  EyeOutlined,
  HeartOutlined,
} from '@ant-design/icons';

import type { BlogPost } from './types';

interface BlogHeaderProps {
  blogPosts: BlogPost[];
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const BlogHeader: React.FC<BlogHeaderProps> = ({ blogPosts }) => {
  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = blogPosts.reduce((sum, post) => sum + post.likes, 0);

  return (
    <motion.section variants={itemVariants} className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
            技术博客
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            分享技术洞察 · 记录成长足迹 · 探索无限可能
          </p>
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center gap-8 text-sm text-gray-500 mb-12"
        >
          <div className="flex items-center gap-2">
            <BookOutlined className="text-blue-500" />
            <span>{blogPosts.length} 篇文章</span>
          </div>
          <div className="flex items-center gap-2">
            <EyeOutlined className="text-green-500" />
            <span>{totalViews} 次阅读</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartOutlined className="text-red-500" />
            <span>{totalLikes} 个赞</span>
          </div>
        </motion.div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/6 w-40 h-40 bg-blue-100 rounded-full opacity-20"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/6 w-32 h-32 bg-purple-100 rounded-full opacity-15"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </motion.section>
  );
};

export default BlogHeader; 
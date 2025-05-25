import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  CommentOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { Card } from '@/components/ui';
import type { BlogPost } from './types';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  onTagClick: (tag: string) => void;
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

const BlogCard: React.FC<BlogCardProps> = ({ post, index, onTagClick }) => {
  return (
    <motion.article
      variants={itemVariants}
      custom={index}
      layout
      className="group relative"
    >
      <Card 
        padding="none" 
        className={`overflow-hidden h-full transition-all duration-300 ${
          post.featured ? 'ring-2 ring-blue-200' : ''
        }`}
        hover={true}
      >
        {/* 特色标签 */}
        {post.featured && (
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            >
              <FireOutlined />
              热门
            </motion.div>
          </div>
        )}

        {/* 文章图片 */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6">
          {/* 分类标签 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              {post.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <CalendarOutlined />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <ClockCircleOutlined />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* 文章标题 */}
          <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          {/* 文章摘要 */}
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 text-sm">
            {post.excerpt}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 作者和统计信息 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <EyeOutlined />
                {post.views}
              </span>
              <span className="flex items-center gap-1">
                <HeartOutlined />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <CommentOutlined />
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.article>
  );
};

export default BlogCard; 
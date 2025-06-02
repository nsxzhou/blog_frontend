import React from 'react';
import { motion } from 'framer-motion';
import { history } from '@umijs/max';
import {
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  CommentOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { UserAvatar } from '@/components/ui';
import {
  itemVariants,
  cardHover,
  scaleIn,
  hoverScale,
  imageVariants,
  titleVariants,
  overlayVariants
} from '@/constants/animations';
import type { BlogPost } from './types';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => {
  const handleCardClick = () => {
    history.push(`/article-detail/${post.id}`);
  };

  return (
    <motion.article
      variants={itemVariants}
      custom={index}
      layout
      onClick={handleCardClick}
      className="group relative cursor-pointer"
    >
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        className={`overflow-hidden h-full bg-white rounded-lg border border-gray-200 shadow-md ${post.featured ? 'ring-2 ring-blue-200' : ''
          }`}
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
            variants={imageVariants}
          />
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
          />
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
            </div>
          </div>

          {/* 文章标题 */}
          <motion.h3
            variants={titleVariants}
            className="text-lg font-semibold mb-3 line-clamp-2"
          >
            {post.title}
          </motion.h3>

          {/* 文章摘要 */}
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 text-sm">
            {post.excerpt}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 cursor-pointer"
                whileHover={{
                  backgroundColor: "#e5e7eb",
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* 作者和统计信息 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <UserAvatar
                user={post.author}
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
      </motion.div>
    </motion.article>
  );
};

export default BlogCard; 